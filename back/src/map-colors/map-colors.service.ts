import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/user.entity';
import { UpdateMapColorsDto } from './dto/update-map-colors.dto';
import { DEFAULT_MAP_COLORS } from './map-colors.defaults';
import { MapColors } from './map-colors.types';

@Injectable()
export class MapColorsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getMapColors(userId: string): Promise<MapColors> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'mapColors'],
    });
    return user?.mapColors ?? DEFAULT_MAP_COLORS;
  }

  async updateMapColors(
    userId: string,
    dto: UpdateMapColorsDto,
  ): Promise<MapColors> {
    const mapColors: MapColors = {
      version: dto.version,
      light: dto.light,
      dark: dto.dark,
    };
    await this.userRepo.update(userId, { mapColors });
    return mapColors;
  }

  async resetMapColors(userId: string): Promise<MapColors> {
    await this.userRepo.update(userId, { mapColors: null });
    return DEFAULT_MAP_COLORS;
  }
}
