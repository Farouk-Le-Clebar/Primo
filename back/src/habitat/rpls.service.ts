import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RplsLogement } from '../database/rpls.entity';
import { NEAR_PARCEL_METERS, NEAR_PARCEL_SQL } from './parcel-geometry';

const MAX_LOGEMENTS = 3000;

export type LogementSocial = RplsLogement;

@Injectable()
export class RplsService {
  constructor(
    @InjectRepository(RplsLogement)
    private readonly rplsRepository: Repository<RplsLogement>,
  ) {}

  async findByParcelle(geometry: string): Promise<LogementSocial[]> {
    return this.rplsRepository
      .createQueryBuilder('rpls')
      .where(`ST_Intersects(rpls.geom, ${NEAR_PARCEL_SQL})`, {
        parcelGeoJson: geometry,
        bufferMeters: NEAR_PARCEL_METERS,
      })
      .orderBy('rpls.adresse', 'ASC')
      .addOrderBy('rpls.etage', 'ASC', 'NULLS LAST')
      .addOrderBy('rpls.surface_habitable', 'ASC')
      .take(MAX_LOGEMENTS)
      .getMany();
  }
}
