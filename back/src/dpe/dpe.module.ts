import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpeController } from './dpe.controller';
import { DpeService } from './dpe.service';
import { DpeLogement } from '../database/dpe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DpeLogement])],
  controllers: [DpeController],
  providers: [DpeService],
  exports: [DpeService],
})
export class DpeModule {}