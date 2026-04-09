import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CheckEmailDto } from './dto/check-email.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { User } from '../database/user.entity';
import { UpdateProfileDto } from './dto/update-profile';
import { AdminGuard } from 'src/guard/admin.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('check-email')
  async checkEmail(@Body() dto: CheckEmailDto) {
    return this.userService.checkEmailExists(dto.email);
  }

  @Get('is-verified')
  @UseGuards(JwtAuthGuard)
  async isVerified(@Req() req: RequestWithUser) {
    if (!req.user.verified) {
      throw new ForbiddenException('User is not verified');
    }
    return { verified: true };
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Get(':from/:to')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getUsers(@Param('from') from: number, @Param('to') to: number) {
    return this.userService.getUsers(from, to);
  }

  @Get('admin/search/:query')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async searchUsers(@Param('query') query: string) {
    return this.userService.searchUsers(query);
  }

  @Post('admin/delete')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteUser(@Body('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get('is-admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async isAdmin(@Req() req: RequestWithUser) {
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(req.user.id, dto);
  }

  @Put('map')
  @UseGuards(JwtAuthGuard)
  async updateMapPreference(
    @Req() req: RequestWithUser,
    @Body('mapPreference') mapPreference: string,
  ) {
    if (mapPreference == null) {
      throw new BadRequestException('mapPreference is required');
    } else if (mapPreference !== 'basic' && mapPreference !== 'satellite') {
      throw new BadRequestException('Invalid mapPreference value');
    }
    return await this.userService.updateMapPreference(req.user.id, mapPreference);
  }
}
