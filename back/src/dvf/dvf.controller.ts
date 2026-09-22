import { Controller, Get, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { DvfService } from './dvf.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('dvf')
export class DvfController {
  constructor(private readonly dvfService: DvfService) {}

  @UseGuards(JwtAuthGuard)
  @Get('parcelle/:id')
  async getVentes(@Param('id') idParcelle: string) {
    if (!idParcelle || idParcelle.trim().length !== 14) {
      throw new BadRequestException('L\'identifiant de la parcelle doit comporter exactement 14 caractères.');
    }

    return await this.dvfService.getHistoriqueByParcelle(idParcelle.trim().toUpperCase());
  }
}