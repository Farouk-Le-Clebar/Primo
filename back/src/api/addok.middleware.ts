import { Injectable, NestMiddleware } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Injectable()
export class AddokProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: process.env.ADDOK_URL,
    changeOrigin: true,
    pathRewrite: { '^/addok': '' },
  });

  constructor(private readonly jwtAuthGuard: JwtAuthGuard) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const context = new ExecutionContextHost([req, res, next]);
    context.setType('http');

    const authenticated = await this.jwtAuthGuard.canActivate(context);

    this.proxy(req, res, next);
  }
}
