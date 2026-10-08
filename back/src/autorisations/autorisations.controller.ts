import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { AutorisationsService } from './autorisations.service';

@Controller('autorisations')
export class AutorisationsController {
  constructor(private readonly autorisationsService: AutorisationsService) {}

  @Get('parcelle/:id')
  async getAutorisations(@Param('id') idParcelle: string) {
    const id = idParcelle.trim().toUpperCase();
    if (!/^[0-9AB]{5}[0-9]{3}[0-9A-Z]{2}[0-9]{4}$/.test(id)) {
      throw new BadRequestException('La référence cadastrale doit comporter 14 caractères valides.');
    }

    return this.autorisationsService.getByParcelle(id);
  }
}
