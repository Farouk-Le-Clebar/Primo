import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DvfController } from './dvf.controller';
import { DvfService } from './dvf.service';
import { DvfMutation } from '../database/dvf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DvfMutation])],
  controllers: [DvfController],
  providers: [DvfService],
  exports: [DvfService],
})
export class DvfModule {}