import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Copropriete } from '../database/copropriete.entity';
import {
  NEAR_PARCEL_METERS,
  NEAR_PARCEL_SQL,
  PARCEL_GEOMETRY_SQL,
} from './parcel-geometry';

const DECLARED_PARCEL_MAX_GAP_METERS = 200;

export type CoproprieteRattachement =
  | 'parcelle'
  | 'parcelle_eloignee'
  | 'adresse';

export type CoproprieteParcelle = Copropriete & {
  rattachement: CoproprieteRattachement;
  distance_adresse: number | null;
};

type DistanceRow = { distance_adresse: string | null };

const RATTACHEMENT_ORDER: CoproprieteRattachement[] = [
  'parcelle',
  'adresse',
  'parcelle_eloignee',
];

@Injectable()
export class CoproprieteService {
  constructor(
    @InjectRepository(Copropriete)
    private readonly coproprieteRepository: Repository<Copropriete>,
  ) {}

  async findByParcelle(
    idParcelle: string,
    geometry: string,
  ): Promise<CoproprieteParcelle[]> {
    const { entities, raw } = await this.coproprieteRepository
      .createQueryBuilder('copro')
      .addSelect(
        `round(ST_Distance(copro.geom::geography, ${PARCEL_GEOMETRY_SQL}::geography))`,
        'distance_adresse',
      )
      .where(
        ':idParcelle IN (copro.id_parcelle_1, copro.id_parcelle_2, copro.id_parcelle_3)',
        { idParcelle },
      )
      .orWhere(
        `(copro.id_parcelle_1 IS NULL AND ST_Intersects(copro.geom, ${NEAR_PARCEL_SQL}))`,
        { bufferMeters: NEAR_PARCEL_METERS },
      )
      .setParameter('parcelGeoJson', geometry)
      .orderBy('copro.nombre_lots', 'DESC', 'NULLS LAST')
      .getRawAndEntities<DistanceRow>();

    return entities
      .map((copropriete, index) => {
        const distance = raw[index]?.distance_adresse;
        return this.withRattachement(
          copropriete,
          idParcelle,
          distance == null ? null : Number(distance),
        );
      })
      .sort(
        (a, b) =>
          RATTACHEMENT_ORDER.indexOf(a.rattachement) -
          RATTACHEMENT_ORDER.indexOf(b.rattachement),
      );
  }

  private withRattachement(
    copropriete: Copropriete,
    idParcelle: string,
    distance: number | null,
  ): CoproprieteParcelle {
    const declared = [
      copropriete.id_parcelle_1,
      copropriete.id_parcelle_2,
      copropriete.id_parcelle_3,
    ].includes(idParcelle);
    const rattachement: CoproprieteRattachement = !declared
      ? 'adresse'
      : distance !== null && distance > DECLARED_PARCEL_MAX_GAP_METERS
        ? 'parcelle_eloignee'
        : 'parcelle';
    return { ...copropriete, rattachement, distance_adresse: distance };
  }
}
