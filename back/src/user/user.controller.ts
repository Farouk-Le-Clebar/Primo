import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CheckEmailDto } from './dto/check-email.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { User } from '../database/user.entity';

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
    console.log('Fetching user by email:', email);
    return this.userService.getUserByEmail(email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: RequestWithUser): Promise<Partial<User>> {
    const { password, ...safeUser } = await this.userService.getUserByEmail(req.user.email);
    return safeUser;
  }
}
