import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { ConnectiviteParcelle } from './connectivite.types';
import { ParcelPointDto } from './dto/parcel-point.dto';
import { EnvironnementService } from './environnement.service';
import { PollutionParcelle } from './pollution.types';

@UseGuards(JwtAuthGuard)
@Controller('environnement')
export class EnvironnementController {
  constructor(private readonly environnementService: EnvironnementService) {}

  @Post('pollution')
  @HttpCode(200)
  async getPollution(@Body() dto: ParcelPointDto): Promise<PollutionParcelle> {
    return this.environnementService.getPollution(dto);
  }

  @Post('connectivite')
  @HttpCode(200)
  async getConnectivite(
    @Body() dto: ParcelPointDto,
  ): Promise<ConnectiviteParcelle> {
    return this.environnementService.getConnectivite(dto);
  }
}
