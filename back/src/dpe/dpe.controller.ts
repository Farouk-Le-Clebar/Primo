import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { DpeService } from './dpe.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('dpe')
export class DpeController {
  constructor(private readonly dpeService: DpeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('ban/:id')
  async getDpe(@Param('id') identifiantBan: string) {
    if (!identifiantBan || identifiantBan.trim().length === 0) {
      throw new BadRequestException('Un identifiant BAN valide est requis.');
    }

    return await this.dpeService.getDpeByBan(identifiantBan.trim());
  }
}