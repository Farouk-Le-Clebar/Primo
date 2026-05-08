import { Controller, Post, Body, UseGuards, Req, Get, Delete, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AdminGuard } from '../guard/admin.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFeedback(@Body() dto: CreateFeedbackDto, @Req() req: any) {
    return await this.feedbackService.create(dto, req.user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllFeedbacks() {
    return await this.feedbackService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteFeedback(@Param('id') id: string) {
    return await this.feedbackService.deleteFeedback(id);
  }
}