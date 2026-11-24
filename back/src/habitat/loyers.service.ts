import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EncadrementLoyer } from '../database/encadrement-loyer.entity';
import { LoyerCommune } from '../database/loyer-commune.entity';
import { PARCEL_GEOMETRY_SQL } from './parcel-geometry';

export interface LoyersParcelle {
  commune: LoyerCommune[];
  encadrement: EncadrementLoyer[];
}

@Injectable()
export class LoyersService {
  constructor(
    @InjectRepository(LoyerCommune)
    private readonly loyerCommuneRepository: Repository<LoyerCommune>,
    @InjectRepository(EncadrementLoyer)
    private readonly encadrementRepository: Repository<EncadrementLoyer>,
  ) {}

  async findByParcelle(
    codeCommune: string,
    geometry: string,
  ): Promise<LoyersParcelle> {
    const [commune, encadrement] = await Promise.all([
      this.loyerCommuneRepository.find({
        where: { code_commune: codeCommune },
      }),
      this.encadrementRepository
        .createQueryBuilder('zone')
        .where(
          `ST_Intersects(zone.geom, ST_PointOnSurface(${PARCEL_GEOMETRY_SQL}))`,
          { parcelGeoJson: geometry },
        )
        .orderBy('zone.meuble', 'ASC')
        .addOrderBy('zone.nombre_pieces', 'ASC')
        .addOrderBy('zone.annee_min', 'ASC', 'NULLS FIRST')
        .getMany(),
    ]);

    return { commune, encadrement };
  }
}
