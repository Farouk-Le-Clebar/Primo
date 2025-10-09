import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApicartoProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: process.env.APICARTO_URL || 'https://apicarto.ign.fr',
    changeOrigin: true,
    pathRewrite: { '^/apicarto': '' },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
