import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GeoServerProxyMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: process.env.GEOSERVER_URL || 'http://localhost:8081/geoserver',
    changeOrigin: true,
    pathRewrite: { '^/geoserver': '' },
    logger: console,

    onProxyReq: (proxyReq, req, res) => {
      console.log(`[GeoServer Proxy] ${req.method} ${req.url}`);
    },
  } as Options);
  
  use(req: Request, res: Response, next: NextFunction) {
    this.proxy(req, res, next);
  }
}
