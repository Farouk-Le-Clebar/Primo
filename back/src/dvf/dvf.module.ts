import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DvfController } from './dvf.controller';
import { DvfService } from './dvf.service';
import { DvfMutation } from '../database/dvf.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([DvfMutation]), JwtModule],
  controllers: [DvfController],
  providers: [DvfService],
  exports: [DvfService],
})
export class DvfModule {}