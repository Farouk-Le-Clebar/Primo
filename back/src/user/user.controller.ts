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
} from '@nestjs/common';
import type { Request } from 'express';
import { CheckEmailDto } from './dto/check-email.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { User } from '../database/user.entity';
import { UpdateProfileDto } from './dto/update-profile';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('check-email')
  async checkEmail(@Body() dto: CheckEmailDto) {
    return this.userService.checkEmailExists(dto.email);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
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
