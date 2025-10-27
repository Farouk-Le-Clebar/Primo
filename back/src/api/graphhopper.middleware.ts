import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GraphhopperProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: process.env.GRAPHHOPPER_URL || 'http://localhost:8989',
    changeOrigin: true,
    pathRewrite: { '^/gh': '' },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
