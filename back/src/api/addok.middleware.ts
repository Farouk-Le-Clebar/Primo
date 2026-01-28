import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AddokProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: process.env.ADDOK_URL,
    changeOrigin: true,
    pathRewrite: { '^/addok': '' },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
