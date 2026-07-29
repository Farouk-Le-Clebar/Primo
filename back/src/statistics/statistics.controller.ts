import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AdminGuard } from '../guard/admin.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllStats() {
    return await this.statisticsService.getAllStats();
  }

  @Get('os/most-used')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getMostUsedOs() {
    return await this.statisticsService.getMostUsedOS();
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getStatsByUser(@Param('id') id: string) {
    return await this.statisticsService.getStatsByUser(id);
  }
}