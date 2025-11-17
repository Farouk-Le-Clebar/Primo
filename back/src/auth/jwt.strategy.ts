import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('✅ JwtStrategy initialisée avec secret =', configService.get<string>('JWT_SECRET'));
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser({
      sub: Number(payload.sub),
      email: payload.email,
    });
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }
}
