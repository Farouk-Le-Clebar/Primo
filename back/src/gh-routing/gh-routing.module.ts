import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphHopperProxyMiddleware } from '../api/graphhopper.middleware';
import { DockerContainerService } from './services/docker-container.service';
import { RegionDetectorService } from './services/region-detector.service';

@Module({
  providers: [
    GraphHopperProxyMiddleware,
    DockerContainerService,
    RegionDetectorService,
  ],
})
export class GhRoutingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GraphHopperProxyMiddleware)
      .forRoutes('graphhopper');
  }
}