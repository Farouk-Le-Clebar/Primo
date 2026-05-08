import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { DpeService } from './dpe.service';

@Controller('dpe')
export class DpeController {
  constructor(private readonly dpeService: DpeService) {}

  @Get('ban/:id')
  async getDpe(@Param('id') identifiantBan: string) {
    if (!identifiantBan || identifiantBan.trim().length === 0) {
      throw new BadRequestException('Un identifiant BAN valide est requis.');
    }

    return await this.dpeService.getDpeByBan(identifiantBan.trim());
  }
}