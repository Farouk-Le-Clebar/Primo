import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { User } from '../database/user.entity';
import { UpdateMapColorsDto } from './dto/update-map-colors.dto';
import { MapColorsService } from './map-colors.service';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('map-colors')
@UseGuards(JwtAuthGuard)
export class MapColorsController {
  constructor(private readonly mapColorsService: MapColorsService) {}

  @Get()
  async getMapColors(@Req() req: RequestWithUser) {
    return this.mapColorsService.getMapColors(req.user.id);
  }

  @Put()
  async updateMapColors(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateMapColorsDto,
  ) {
    return this.mapColorsService.updateMapColors(req.user.id, dto);
  }

  @Delete()
  async resetMapColors(@Req() req: RequestWithUser) {
    return this.mapColorsService.resetMapColors(req.user.id);
  }
}
