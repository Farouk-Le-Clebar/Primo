import { Body, Controller, Post } from '@nestjs/common';
import { ProximiteService } from './proximite.service';
import { ComputeProximiteDto } from './dto/compute-proximite.dto';

@Controller('proximite')
export class ProximiteController {
  constructor(private readonly proximiteService: ProximiteService) {}

  @Post('compute')
  compute(@Body() dto: ComputeProximiteDto) {
    return this.proximiteService.compute(dto);
  }
}