import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DpeController } from './dpe.controller';
import { DpeService } from './dpe.service';
import { DpeEntity } from '../database/dpe.entity';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([DpeEntity]), JwtModule],
  controllers: [DpeController],
  providers: [DpeService],
  exports: [DpeService],
})
export class DpeModule {}