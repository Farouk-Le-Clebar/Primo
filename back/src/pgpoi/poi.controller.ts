import { Controller, Get, Query } from '@nestjs/common';
import { PoiService } from './poi.service';
import { GetPoisDto } from './dto/get-pois.dto';

@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get()
  async getPois(@Query() dto: GetPoisDto) {
    return this.poiService.getPoisInBounds(dto);
  }

  @Get('types')
  async getAvailableTypes() {
    return this.poiService.getAvailablePoiTypes();
  }
}