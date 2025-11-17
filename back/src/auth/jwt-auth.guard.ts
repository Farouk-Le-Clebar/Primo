import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('🔐 JwtAuthGuard: headers reçus =>', request.headers);
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    console.log("JWT secret utilisé:", process.env.JWT_SECRET || 'secretKey');
    if (err || !user) {
      throw err || new UnauthorizedException('Token invalide ou manquant');
    }
    return user;
  }
}
