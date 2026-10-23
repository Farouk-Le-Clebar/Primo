import { Module } from '@nestjs/common';
import { ProximiteController } from './proximite.controller';
import { ProximiteService } from './proximite.service';

@Module({
  controllers: [ProximiteController],
  providers: [ProximiteService],
  exports: [ProximiteService],
})
export class ProximiteModule {}