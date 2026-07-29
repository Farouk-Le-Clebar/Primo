import { Body, Controller, Post, Get, UseGuards, Request, Req } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { StatisticsService } from '../statistics/statistics.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private statisticsService: StatisticsService,
  ) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.email,
      dto.firstName,
      dto.surName,
      dto.password,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: ExpressRequest) {
    const result = await this.authService.login(dto.email, dto.password);
    this.statisticsService.logConnection(result.user.id, req).catch(console.error);
    return result;
  }

  @Post('google')
  async googleLogin(@Body() dto: GoogleLoginDto, @Req() req: ExpressRequest) {
    const result = await this.authService.googleLogin(dto.token);
    this.statisticsService.logConnection(result.user.id, req).catch(console.error);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verifyToken(@Request() req: ExpressRequest & { user: any }) {
    await this.authService.updateLastConnection(req.user.id);
    this.statisticsService.logConnection(req.user.id, req).catch(console.error);
    const { id, ...userWithoutId } = req.user;
    return userWithoutId;
  }
}