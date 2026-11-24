import { Injectable, Logger } from '@nestjs/common';
import { AntennesService } from './antennes.service';
import { ConnectiviteParcelle } from './connectivite.types';
import { ParcelPointDto } from './dto/parcel-point.dto';
import { FibreService } from './fibre.service';
import { PollutionParcelle } from './pollution.types';
import { QualiteAirService } from './qualite-air.service';
import { SolsPolluesService } from './sols-pollues.service';

@Injectable()
export class EnvironnementService {
  private readonly logger = new Logger(EnvironnementService.name);

  constructor(
    private readonly solsPolluesService: SolsPolluesService,
    private readonly qualiteAirService: QualiteAirService,
    private readonly antennesService: AntennesService,
    private readonly fibreService: FibreService,
  ) {}

  async getPollution(point: ParcelPointDto): Promise<PollutionParcelle> {
    const [sols, air] = await Promise.all([
      this.settle('Géorisques', this.solsPolluesService.findAround(point)),
      this.settle('Open-Meteo', this.qualiteAirService.findCurrent(point)),
    ]);
    return { sols, air };
  }

  async getConnectivite(point: ParcelPointDto): Promise<ConnectiviteParcelle> {
    const [mobile, fixe] = await Promise.all([
      this.settle('ANFR', this.antennesService.findAround(point)),
      this.settle('Arcep', this.fibreService.findByCommune(point.codeInsee)),
    ]);
    return { mobile, fixe };
  }

  private async settle<T>(
    source: string,
    request: Promise<T>,
  ): Promise<T | null> {
    try {
      return await request;
    } catch (error: unknown) {
      this.logger.warn(
        `${source} indisponible : ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }
}
