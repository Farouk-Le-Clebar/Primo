import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LatLon, distanceMeters, nearestDistance } from './geo';
import {
  InstallationClassee,
  SitePollue,
  SolsPollues,
} from './pollution.types';

const GEORISQUES_URL = 'https://georisques.gouv.fr/api/v1';
const TIMEOUT_MS = 15000;
const SITES_RADIUS_METERS = 500;
const INSTALLATIONS_RADIUS_METERS = 1000;
const PAGE_SIZE = 100;
const NEAREST_COUNT = 5;

type GeorisquesPage<T> = { results?: number; data?: T[] };

type SspRow = {
  identifiant_ssp?: string;
  id_sis?: string;
  nom_etablissement?: string | null;
  nom?: string | null;
  adresse?: string | null;
  nom_commune?: string | null;
  statut?: string | null;
  statut_classification?: string | null;
  fiche_risque?: string | null;
  geom?: { coordinates?: unknown } | null;
};

type SspResponse = {
  casias?: GeorisquesPage<SspRow>;
  instructions?: GeorisquesPage<SspRow>;
  conclusions_sis?: GeorisquesPage<SspRow>;
  conclusions_sup?: GeorisquesPage<SspRow>;
};

type IcpeRow = {
  codeAIOT?: string;
  raisonSociale?: string | null;
  adresse1?: string | null;
  commune?: string | null;
  regime?: string | null;
  statutSeveso?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

const joinAddress = (...parts: (string | null | undefined)[]): string | null =>
  parts.filter((part) => part && part.trim()).join(', ') || null;

const byDistance = <T extends { id: string; distanceMetres: number | null }>(
  rows: T[],
): T[] =>
  [...new Map(rows.map((row) => [row.id, row])).values()].sort(
    (a, b) => (a.distanceMetres ?? Infinity) - (b.distanceMetres ?? Infinity),
  );

@Injectable()
export class SolsPolluesService {
  async findAround(origin: LatLon): Promise<SolsPollues> {
    const latlon = `${origin.longitude},${origin.latitude}`;
    const [ssp, icpe] = await Promise.all([
      axios.get<SspResponse>(`${GEORISQUES_URL}/ssp`, {
        params: { latlon, rayon: SITES_RADIUS_METERS, page_size: PAGE_SIZE },
        timeout: TIMEOUT_MS,
      }),
      axios.get<GeorisquesPage<IcpeRow>>(
        `${GEORISQUES_URL}/installations_classees`,
        {
          params: {
            latlon,
            rayon: INSTALLATIONS_RADIUS_METERS,
            page_size: PAGE_SIZE,
          },
          timeout: TIMEOUT_MS,
        },
      ),
    ]);
    const sites = (page?: GeorisquesPage<SspRow>): SitePollue[] =>
      byDistance((page?.data ?? []).map((row) => this.toSite(origin, row)));
    const installations = byDistance(
      (icpe.data.data ?? []).map((row) => this.toInstallation(origin, row)),
    );

    return {
      rayonSitesMetres: SITES_RADIUS_METERS,
      rayonInstallationsMetres: INSTALLATIONS_RADIUS_METERS,
      sis: sites(ssp.data.conclusions_sis),
      instructions: sites(ssp.data.instructions),
      servitudes: sites(ssp.data.conclusions_sup),
      anciensSitesTotal: ssp.data.casias?.results ?? 0,
      anciensSites: sites(ssp.data.casias).slice(0, NEAREST_COUNT),
      installationsTotal: icpe.data.results ?? installations.length,
      installations: installations.slice(0, NEAREST_COUNT),
    };
  }

  private toSite(origin: LatLon, row: SspRow): SitePollue {
    return {
      id: row.id_sis ?? row.identifiant_ssp ?? '',
      nom: row.nom_etablissement ?? row.nom ?? null,
      adresse: joinAddress(row.adresse, row.nom_commune),
      statut: row.statut ?? row.statut_classification ?? null,
      distanceMetres: nearestDistance(origin, row.geom),
      fiche: row.fiche_risque ?? null,
    };
  }

  private toInstallation(origin: LatLon, row: IcpeRow): InstallationClassee {
    const hasPosition =
      Number.isFinite(row.latitude) && Number.isFinite(row.longitude);
    return {
      id: row.codeAIOT ?? '',
      nom: row.raisonSociale ?? null,
      adresse: joinAddress(row.adresse1, row.commune),
      regime: row.regime ?? null,
      seveso: row.statutSeveso ?? null,
      distanceMetres: hasPosition
        ? distanceMeters(origin, {
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
          })
        : null,
    };
  }
}
