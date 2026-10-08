import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ComputeProximiteDto } from './dto/compute-proximite.dto';

const MAX_DISTANCE_METERS = 30_000;
const MAX_REQUESTED_TYPES = 20;

@Injectable()
export class ProximiteService {
  constructor(
    @InjectDataSource('bdtopo')
    private readonly dataSource: DataSource,
  ) {}

  async compute(dto: ComputeProximiteDto) {
    const { geometry, types } = dto;

    if (
      !geometry ||
      !['Polygon', 'MultiPolygon'].includes(String(geometry.type)) ||
      !Array.isArray(geometry.coordinates)
    ) {
      throw new BadRequestException(
        'La géométrie doit être un GeoJSON Polygon ou MultiPolygon.',
      );
    }

    if (!Array.isArray(types) || types.length === 0) {
      throw new BadRequestException(
        "Au moins un type d'infrastructure doit être sélectionné.",
      );
    }

    if (types.length > MAX_REQUESTED_TYPES) {
      throw new BadRequestException(
        "Trop de types d'infrastructures demandés.",
      );
    }

    
    const sql = `
      WITH parcel AS (
        SELECT
          ST_Centroid(
            ST_SetSRID(
              ST_GeomFromGeoJSON($1::text),
              4326
            )
          ) AS geom
      ),

      requested_types AS (
        SELECT unnest($2::text[]) AS type_code
      )

      SELECT
        rt.type_code AS requested_type,

        nearest.id,
        nearest.type_code,
        nearest.famille,
        nearest.label,
        nearest.nom,
        nearest.adresse,

        nearest.distance_m,

        CASE
          WHEN nearest.distance_m IS NULL THEN 0
          WHEN nearest.distance_m <= 300 THEN 100
          ELSE GREATEST(
            0,
            LEAST(
              100,
              ROUND(
                100.0
                * (${MAX_DISTANCE_METERS} - nearest.distance_m)
                / (${MAX_DISTANCE_METERS} - 300)
              )::int
            )
          )
        END AS score

      FROM requested_types rt

      CROSS JOIN parcel p

      LEFT JOIN LATERAL (
        SELECT
          i.id,
          i.geom,
          t.code AS type_code,
          t.famille,
          t.label,
          i.nom,
          i.adresse,

          ST_Distance(
            i.geom::geography,
            p.geom::geography
          ) AS distance_m

        FROM public.infrastructures i

        INNER JOIN public.infrastructure_types t
          ON t.id = i.type_id

        WHERE
          t.code = rt.type_code

          AND i.geom IS NOT NULL

          AND ST_DWithin(
            i.geom::geography,
            p.geom::geography,
            ${MAX_DISTANCE_METERS}
          )

        ORDER BY
          i.geom <-> p.geom

        LIMIT 1

      ) nearest ON TRUE

      ORDER BY rt.type_code;
    `;

    return this.dataSource.query(sql, [JSON.stringify(geometry), types]);
  }
}
