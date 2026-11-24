import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  Generation,
  OperateurMobile,
  ReseauMobile,
} from './connectivite.types';
import { LatLon, distanceMeters } from './geo';

const ANFR_URL = 'https://data.anfr.fr/d4c/api/records/1.0/search/';
const DATASET = 'observatoire_2g_3g_4g';
const TIMEOUT_MS = 15000;
const MAX_ROWS = 1000;
const NEAR_RADIUS_METERS = 1000;
const FAR_RADIUS_METERS = 5000;
const ACTIVE_STATUSES = ['En service', 'Techniquement opérationnel'];
const GENERATIONS: Generation[] = ['2G', '3G', '4G', '5G'];
const OPERATORS: Record<string, string> = {
  ORANGE: 'Orange',
  SFR: 'SFR',
  'BOUYGUES TELECOM': 'Bouygues Telecom',
  'FREE MOBILE': 'Free',
};

type AnfrRecord = {
  fields: {
    adm_lb_nom?: string;
    generation?: string;
    statut?: string;
    coordonnees?: string;
  };
};

type Antenne = {
  operateur: string;
  generation: Generation;
  distanceMetres: number;
};

@Injectable()
export class AntennesService {
  async findAround(origin: LatLon): Promise<ReseauMobile> {
    const [near, far] = await Promise.all([
      this.fetchAntennes(origin, NEAR_RADIUS_METERS),
      this.fetchAntennes(origin, FAR_RADIUS_METERS),
    ]);
    const antennes = [...near, ...far];

    return {
      rayonMetres: FAR_RADIUS_METERS,
      antennesActives: near.length,
      operateurs: Object.values(OPERATORS).map((operateur) =>
        this.summarize(
          operateur,
          antennes.filter((antenne) => antenne.operateur === operateur),
        ),
      ),
    };
  }

  private async fetchAntennes(
    origin: LatLon,
    radius: number,
  ): Promise<Antenne[]> {
    const { data } = await axios.get<{ records?: AnfrRecord[] }>(ANFR_URL, {
      params: {
        dataset: DATASET,
        rows: MAX_ROWS,
        'geofilter.distance': `${origin.latitude},${origin.longitude},${radius}`,
        fields: 'adm_lb_nom,generation,statut,coordonnees',
      },
      timeout: TIMEOUT_MS,
    });
    return (data.records ?? []).flatMap(({ fields }) => {
      const operateur = OPERATORS[fields.adm_lb_nom ?? ''];
      const generation = GENERATIONS.find(
        (value) => value === fields.generation,
      );
      const [latitude, longitude] = (fields.coordonnees ?? '')
        .split(',')
        .map((value) => Number(value.trim()));
      if (
        !operateur ||
        !generation ||
        !ACTIVE_STATUSES.includes(fields.statut ?? '')
      )
        return [];
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
      return [
        {
          operateur,
          generation,
          distanceMetres: distanceMeters(origin, { latitude, longitude }),
        },
      ];
    });
  }

  private summarize(operateur: string, antennes: Antenne[]): OperateurMobile {
    const nearest = (generation: Generation): number | null => {
      const distances = antennes
        .filter((antenne) => antenne.generation === generation)
        .map((antenne) => antenne.distanceMetres);
      return distances.length ? Math.min(...distances) : null;
    };
    const best =
      [...GENERATIONS]
        .reverse()
        .find((generation) => nearest(generation) !== null) ?? null;

    return {
      operateur,
      meilleureGeneration: best,
      distance4gMetres: nearest('4G'),
      distance5gMetres: nearest('5G'),
    };
  }
}
