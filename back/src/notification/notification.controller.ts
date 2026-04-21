import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResponseDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Request() req: any): Promise<NotificationResponseDto[]> {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any): Promise<{ count: number }> {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<NotificationResponseDto> {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Request() req: any): Promise<void> {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<void> {
    return this.notificationService.deleteNotification(id, req.user.id);
  }

  @Post('seed-welcome')
  async seedWelcome(): Promise<{ sent: number; skipped: number }> {
    return this.notificationService.sendWelcomeToExistingUsers();
  }
}
