import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CoproprieteParcelle, CoproprieteService } from './copropriete.service';
import { ParcelleHabitatDto } from './dto/parcelle-habitat.dto';
import { LoyersParcelle, LoyersService } from './loyers.service';
import { parcelGeometry } from './parcel-geometry';
import { LogementSocial, RplsService } from './rpls.service';

const COMMUNE_CODE_LENGTH = 5;

@UseGuards(JwtAuthGuard)
@Controller('habitat')
export class HabitatController {
  constructor(
    private readonly coproprieteService: CoproprieteService,
    private readonly rplsService: RplsService,
    private readonly loyersService: LoyersService,
  ) {}

  @Post('coproprietes')
  @HttpCode(200)
  async getCoproprietes(
    @Body() dto: ParcelleHabitatDto,
  ): Promise<CoproprieteParcelle[]> {
    return this.coproprieteService.findByParcelle(
      dto.idParcelle,
      parcelGeometry(dto.geometry),
    );
  }

  @Post('logements-sociaux')
  @HttpCode(200)
  async getLogementsSociaux(
    @Body() dto: ParcelleHabitatDto,
  ): Promise<LogementSocial[]> {
    return this.rplsService.findByParcelle(parcelGeometry(dto.geometry));
  }

  @Post('loyers')
  @HttpCode(200)
  async getLoyers(@Body() dto: ParcelleHabitatDto): Promise<LoyersParcelle> {
    return this.loyersService.findByParcelle(
      dto.idParcelle.slice(0, COMMUNE_CODE_LENGTH),
      parcelGeometry(dto.geometry),
    );
  }
}
