import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetPoisDto, PoiResponse } from './dto/get-pois.dto';

@Injectable()
export class PoiService {
  constructor(
    @InjectDataSource('postgis')
    private postgisConnection: DataSource,
  ) {}

  async getPoisInBounds(dto: GetPoisDto): Promise<PoiResponse[]> {
    const { minLat, minLon, maxLat, maxLon, types, zoom = 10 } = dto;

    if (zoom < 12) {
      return [];
    }

    const limit = this.calculateLimit(zoom);

    let query = `
      SELECT 
        osm_id::text as id,
        tags->>'name' as name,
        COALESCE(tags->>'poi_type', tags->>'amenity', tags->>'shop') as type,
        tags->>'poi_category' as category,
        ST_Y(geom) as lat,
        ST_X(geom) as lon,
        tags
      FROM pois_france
      WHERE 
        geom && ST_MakeEnvelope($1, $2, $3, $4, 4326)
    `;

    const params: any[] = [minLon, minLat, maxLon, maxLat];

    if (types && types.length > 0) {
      query += ` AND (
        tags->>'amenity' = ANY($5) OR 
        tags->>'shop' = ANY($5) OR
        tags->>'leisure' = ANY($5)
      )`;
      params.push(types);
      query += ` LIMIT $6`;
      params.push(limit);
    } else {
      query += ` LIMIT $5`;
      params.push(limit);
    }

    const results = await this.postgisConnection.query(query, params);

    return results
      .filter((poi: any) => poi.name && poi.name !== 'null')
      .map((poi: any) => ({
        id: poi.id,
        name: poi.name || 'Sans nom',
        type: poi.type,
        category: poi.category,
        lat: parseFloat(poi.lat),
        lon: parseFloat(poi.lon),
        tags: poi.tags,
      }));
  }

  async getAvailablePoiTypes(): Promise<
    { type: string; category: string; count: number }[]
  > {
    const query = `
      SELECT 
        tags->>'poi_type' as type,
        tags->>'poi_category' as category,
        COUNT(*) as count
      FROM pois_france
      GROUP BY tags->>'poi_type', tags->>'poi_category'
      ORDER BY count DESC;
    `;

    const results = await this.postgisConnection.query(query);

    return results.map((row: any) => ({
      type: row.type,
      category: row.category,
      count: parseInt(row.count, 10),
    }));
  }

  private calculateLimit(zoom: number): number {
    if (zoom >= 16) return 500; // Vue très proche
    if (zoom >= 14) return 200; // Vue quartier
    if (zoom >= 12) return 100; // Vue ville
    return 50; // Vue lointaine
  }
}