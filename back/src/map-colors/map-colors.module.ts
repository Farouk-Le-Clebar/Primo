import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { MapColorsController } from './map-colors.controller';
import { MapColorsService } from './map-colors.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MapColorsController],
  providers: [MapColorsService],
})
export class MapColorsModule {}
