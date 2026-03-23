import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { DvfService } from './dvf.service';

@Controller('dvf')
export class DvfController {
  constructor(private readonly dvfService: DvfService) {}

  @Get('parcelle/:id')
  async getVentes(@Param('id') idParcelle: string) {
    if (!idParcelle || idParcelle.trim().length !== 14) {
      throw new BadRequestException('L\'identifiant de la parcelle doit comporter exactement 14 caractères.');
    }

    return await this.dvfService.getHistoriqueByParcelle(idParcelle.trim().toUpperCase());
  }
}