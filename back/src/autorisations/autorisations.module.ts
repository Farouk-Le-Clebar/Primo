import { Module } from '@nestjs/common';
import { AutorisationsController } from './autorisations.controller';
import { AutorisationsService } from './autorisations.service';

@Module({
  controllers: [AutorisationsController],
  providers: [AutorisationsService],
})
export class AutorisationsModule {}
