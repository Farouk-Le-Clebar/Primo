import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Point, RegionConfig } from '../types/region.types';
import * as fs from 'fs';
import * as path from 'path';

interface Polygon {
  rings: Array<Array<[number, number]>>; // [lon, lat]
}

@Injectable()
export class RegionDetectorService implements OnModuleInit {
  private readonly logger = new Logger(RegionDetectorService.name);
  private regionPolygons: Map<string, Polygon> = new Map();

  async onModuleInit() {
    this.logger.log('Initialisation du détecteur de régions avec fichiers .poly');
  }

  /**
   * Charge le fichier .poly d'une région
   */
  private loadPolyFile(regionId: string, polyPath: string): Polygon {
    try {
      const content = fs.readFileSync(polyPath, 'utf-8');
      return this.parsePolyFile(content);
    } catch (error) {
      this.logger.error(`Impossible de charger le fichier .poly pour ${regionId}`, error);
      throw new Error(`Fichier .poly manquant pour ${regionId}: ${polyPath}`);
    }
  }

  /**
   * Parse un fichier .poly (format Osmosis)
   * Format:
   * region_name
   * 1
   *    lon1    lat1
   *    lon2    lat2
   *    ...
   * END
   * END
   */
  private parsePolyFile(content: string): Polygon {
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    const rings: Array<Array<[number, number]>> = [];
    let currentRing: Array<[number, number]> = [];
    let inRing = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^\d+$/)) {
        if (currentRing.length > 0) {
          rings.push(currentRing);
        }
        currentRing = [];
        inRing = true;
        continue;
      }

      if (line === 'END') {
        if (inRing && currentRing.length > 0) {
          rings.push(currentRing);
          currentRing = [];
          inRing = false;
        }
        continue;
      }

      if (inRing) {
        const parts = line.split(/\s+/).filter(p => p);
        if (parts.length >= 2) {
          const lon = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          if (!isNaN(lon) && !isNaN(lat)) {
            currentRing.push([lon, lat]);
          }
        }
      }
    }

    if (rings.length === 0) {
      throw new Error('Aucun polygone trouvé dans le fichier .poly');
    }

    return { rings };
  }

  /**
   * Détecte dans quelle région se trouve un point GPS (avec précision polygonale)
   */
  detectRegion(point: Point, regions: RegionConfig[]): RegionConfig | null {
    this.logger.debug(`Détection de région pour le point (${point.lat}, ${point.lon})`);

    for (const region of regions) {
      if (!this.isPointInBoundingBox(point, region)) {
        continue;
      }

      if (this.isPointInRegionPolygon(point, region)) {
        this.logger.log(`Point trouvé dans la région: ${region.name}`);
        return region;
      }
    }

    this.logger.warn(`Aucune région trouvée pour le point (${point.lat}, ${point.lon})`);
    return null;
  }

  private isPointInBoundingBox(point: Point, region: RegionConfig): boolean {
    const { minLat, maxLat, minLon, maxLon } = region.bounds;
    return (
      point.lat >= minLat &&
      point.lat <= maxLat &&
      point.lon >= minLon &&
      point.lon <= maxLon
    );
  }


  private isPointInRegionPolygon(point: Point, region: RegionConfig): boolean {
    if (!this.regionPolygons.has(region.id)) {
      const polyPath = path.join(
        process.cwd(),
        region.dataPath,
        region.polyFile || `${region.id}.poly`,
      );
      
      try {
        const polygon = this.loadPolyFile(region.id, polyPath);
        this.regionPolygons.set(region.id, polygon);
      } catch (error) {
        this.logger.warn(
          `Fichier .poly non trouvé pour ${region.name}, utilisation de la bounding box`,
        );

        // Fallback sur bounding box si pas de fichier .poly
        return this.isPointInBoundingBox(point, region);
      }
    }

    const polygon = this.regionPolygons.get(region.id);
    if (!polygon || polygon.rings.length === 0) {
      return this.isPointInBoundingBox(point, region);
    }

    const outerRing = polygon.rings[0];
    const isInOuter = this.pointInPolygon([point.lon, point.lat], outerRing);

    if (!isInOuter) {
      return false;
    }

    for (let i = 1; i < polygon.rings.length; i++) {
      const hole = polygon.rings[i];
      if (this.pointInPolygon([point.lon, point.lat], hole)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Algorithme Ray Casting pour point-in-polygon
   */
  private pointInPolygon(
    point: [number, number],
    polygon: Array<[number, number]>,
  ): boolean {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * Détecte la région pour un itinéraire (from -> to)
   */
  detectRegionForRoute(
    from: Point,
    to: Point,
    regions: RegionConfig[],
  ): RegionConfig | null {
    const fromRegion = this.detectRegion(from, regions);
    const toRegion = this.detectRegion(to, regions);

    if (!fromRegion || !toRegion) {
      this.logger.error('Un ou plusieurs points sont hors des régions configurées');
      return null;
    }

    if (fromRegion.id !== toRegion.id) {
      this.logger.warn(
        `Les points sont dans des régions différentes: ${fromRegion.name} -> ${toRegion.name}`,
      );
      return fromRegion;
    }

    return fromRegion;
  }

  /**
   * Calcule la distance approximative entre deux points (en km)
   */
  calculateDistance(point1: Point, point2: Point): number {
    const R = 6371;
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lon - point1.lon);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }


  clearCache(): void {
    this.regionPolygons.clear();
    this.logger.log('Cache des polygones nettoyé');
  }
}