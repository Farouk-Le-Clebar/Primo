import { Injectable, NestMiddleware, Logger, BadRequestException } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';
import { RegionDetectorService } from '../gh-routing/services/region-detector.service';
import { DockerContainerService } from '../gh-routing/services/docker-container.service';
import { GraphHopperConfig, RegionConfig } from '../gh-routing/types/region.types';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GraphHopperProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GraphHopperProxyMiddleware.name);
  private config: GraphHopperConfig;
  private currentRegion: RegionConfig | null = null;
  private proxyCache: Map<string, any> = new Map();
  private isTransitioning = false;

  constructor(
    private readonly regionDetector: RegionDetectorService,
    private readonly dockerService: DockerContainerService,
  ) {
    this.loadConfiguration();
  }


  private loadConfiguration() {
    const configPath = path.join(
      process.cwd(),
      'gh-routing',
      'gh-manager',
      'regions.config.json',
    );

    try {
      const configFile = fs.readFileSync(configPath, 'utf-8');
      this.config = JSON.parse(configFile);
      this.logger.log(`Configuration chargée: ${this.config.regions.length} régions`);
    } catch (error) {
      this.logger.error('Erreur lors du chargement de la configuration', error);
      throw new Error('Impossible de charger la configuration GraphHopper');
    }
  }


  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const region = await this.determineRegion(req);

      if (!region) {
        return res.status(400).json({
          error: 'Unable to determine region',
          message: 'Please provide valid coordinates or regionId parameter',
        });
      }

      await this.ensureRegionActive(region);

      const proxy = this.getProxyForRegion(region);

      proxy(req, res, next);
    } catch (error) {
      this.logger.error('Erreur dans le middleware GraphHopper', error);
      return res.status(500).json({
        error: 'GraphHopper proxy error',
        message: error.message,
      });
    }
  }


  private async determineRegion(req: Request): Promise<RegionConfig | null> {
    const regionIdFromHeader = req.headers['x-graphhopper-region'] as string;
    const regionIdFromQuery = req.query.regionId as string;
    const regionId = regionIdFromHeader || regionIdFromQuery;

    if (regionId) {
      this.logger.log(`Région spécifiée: ${regionId}`);
      const region = this.config.regions.find((r) => r.id === regionId);
      if (region) return region;

      this.logger.warn(`Région "${regionId}" non trouvée`);
    }

    // Détection automatique depuis les coordonnées GPS
    const points = this.extractPointsFromRequest(req);
    if (points.length > 0) {
      this.logger.log('Détection automatique de la région depuis les coordonnées');
      return this.regionDetector.detectRegion(points[0], this.config.regions);
    }

    return null;
  }

  /**
   * Extrait les coordonnées GPS de la requête
   */
  private extractPointsFromRequest(req: Request): Array<{ lat: number; lon: number }> {
    const points: Array<{ lat: number; lon: number }> = [];

    if (req.query.point) {
      const pointParams = Array.isArray(req.query.point) 
        ? req.query.point 
        : [req.query.point];

      for (const point of pointParams) {
        const [lat, lon] = (point as string).split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lon)) {
          points.push({ lat, lon });
        }
      }
    }

    if (req.body) {
      if (req.body.from && typeof req.body.from.lat === 'number' && typeof req.body.from.lon === 'number') {
        points.push({ lat: req.body.from.lat, lon: req.body.from.lon });
      }
      if (req.body.to && typeof req.body.to.lat === 'number' && typeof req.body.to.lon === 'number') {
        points.push({ lat: req.body.to.lat, lon: req.body.to.lon });
      }
    }

    return points;
  }

  /**
   * Région active ?
   */
  private async ensureRegionActive(region: RegionConfig): Promise<void> {
    if (this.currentRegion?.id === region.id) {
      return;
    }
    while (this.isTransitioning) {
      await this.sleep(1000);
    }
    if (this.currentRegion?.id === region.id) {
      return;
    }
    await this.switchRegion(region);
  }


  private async switchRegion(region: RegionConfig): Promise<void> {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.logger.log(`Changement de région vers ${region.name}`);

    try {
      if (this.currentRegion) {
        this.logger.log(`Arrêt de ${this.currentRegion.name}`);
        await this.dockerService.stopContainer(
          this.currentRegion.containerName,
          this.config.containerConfig.shutdownTimeout / 1000,
        );
      }

      this.logger.log(`Démarrage de ${region.name}`);
      await this.dockerService.startContainer(region, this.config.containerConfig);

      const isHealthy = await this.dockerService.waitForHealthy(
        region,
        this.config.containerConfig.startupTimeout,
      );

      if (!isHealthy) {
        throw new Error(`GraphHopper n'a pas démarré correctement pour ${region.name}`);
      }

      this.currentRegion = region;
      this.logger.log(`Région ${region.name} active et prête`);
    } catch (error) {
      this.logger.error('Erreur lors du changement de région', error);
      throw error;
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * Récupère ou crée un proxy pour une région
   */
  private getProxyForRegion(region: RegionConfig): any {
    if (this.proxyCache.has(region.id)) {
      return this.proxyCache.get(region.id);
    }

    const proxyOptions: any = {
      target: `http://localhost:${region.port}`,
      changeOrigin: true,
      pathRewrite: { '^/graphhopper': '' },
      
      onError: (err: any, req: any, res: any) => {
        this.logger.error(`Erreur proxy pour ${region.name}:`, err?.message ?? err);
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Bad Gateway',
            message: `GraphHopper (${region.name}) is not responding`,
          });
        }
      }
    };

    const proxy = createProxyMiddleware(proxyOptions);
    this.proxyCache.set(region.id, proxy);
    return proxy;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
