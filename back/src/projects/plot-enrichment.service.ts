import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DpeService } from '../dpe/dpe.service';
import { DvfService } from '../dvf/dvf.service';
import { AutorisationsService } from '../autorisations/autorisations.service';
import { ProximiteService } from '../proximite/proximite.service';
import { PlotEnrichmentErrors, ProjectPlots } from '../database/project-plots.entity';

const NATIONAL_WFS_URL = 'https://data.geopf.fr/wfs/ows';
const WFS_TIMEOUT_MS = 15000;
const METEO_BBOX_MARGIN = 0.45;
const METEO_VALID_FILTER = 'temp_moy_annuelle > -1000 AND temp_moy_annuelle < 1000';

const METEO_KEYS = [
    'temp_moy_annuelle', 'temp_max_annuelle', 'temp_min_annuelle',
    'temp_moy_ete', 'temp_max_ete', 'temp_min_ete', 'temp_max_abs_ete',
    'temp_moy_hiver', 'temp_max_hiver', 'temp_min_hiver', 'temp_min_abs_hiver',
    'prec_annuelles', 'prec_max_mensuel', 'prec_min_mensuel',
    'prec_ete_total', 'prec_ete_moy', 'prec_hiver_total', 'prec_hiver_moy',
];

// Same list as the infrastructure selector of the parcel dashboard.
const PROXIMITY_TYPES = [
    'bibliotheque', 'cinema', 'musee', 'centre_culturel', 'theatre',
    'terrain_sport', 'centre_sportif', 'stade',
    'hopital', 'pharmacie',
    'supermarche', 'centre_commercial', 'epicerie', 'grand_magasin',
    'gare', 'parc',
    'police', 'caserne_pompiers',
];

// [key in the "plu" snapshot, national GPU layer, local GeoServer layer suffix]
const GPU_LAYERS: [string, string, string][] = [
    ['prescriptionsSurf', 'wfs_du:prescription_surf', 'prescription_surf'],
    ['prescriptionsLin', 'wfs_du:prescription_lin', 'prescription_lin'],
    ['prescriptionsPct', 'wfs_du:prescription_pct', 'prescription_pct'],
    ['informationsSurf', 'wfs_du:info_surf', 'info_surf'],
    ['informationsLin', 'wfs_du:info_lin', 'info_lin'],
    ['informationsPct', 'wfs_du:info_pct', 'info_pct'],
];

type Geometry = { type: string; coordinates: any };
type EnrichmentInput = {
    plotId: string;
    plotBanId: string;
    geometry: Geometry | null;
    parcelProperties?: Record<string, any>;
    addressProperties?: Record<string, any>;
};
export type PlotEnrichment = Partial<Omit<ProjectPlots, 'id' | 'projectId' | 'plotId' | 'plotBanId' | 'coordinates' | 'adress' | 'geometry' | 'aiNotes'>>;

// Collects what each dataset returned; a failing source never blocks the others.
@Injectable()
export class PlotEnrichmentService {
    private readonly logger = new Logger(PlotEnrichmentService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly dvfService: DvfService,
        private readonly dpeService: DpeService,
        private readonly autorisationsService: AutorisationsService,
        private readonly proximiteService: ProximiteService,
    ) { }

    // The front sends the geometry as a JSON string.
    parseGeometry(raw: unknown): Geometry | null {
        try {
            const geometry = typeof raw === 'string' ? JSON.parse(raw) : raw;
            return geometry && typeof geometry === 'object' && (geometry as Geometry).coordinates ? geometry as Geometry : null;
        } catch {
            return null;
        }
    }

    async enrich(input: EnrichmentInput): Promise<PlotEnrichment> {
        const { geometry, parcelProperties, addressProperties } = input;
        const parcelId = input.plotId.trim().toUpperCase();
        const communeCode = String(parcelProperties?.commune ?? parcelId.slice(0, 5) ?? '') || null;
        const department = communeCode ? communeCode.slice(0, communeCode.startsWith('97') ? 3 : 2) : null;
        const centroid = geometry ? this.centroid(geometry) : null;
        const errors: PlotEnrichmentErrors = {};

        const tasks: Record<string, Promise<unknown>> = {
            dvf: this.orNull(this.dvfService.getHistoriqueByParcelle(parcelId)),
            dpe: input.plotBanId ? this.orNull(this.dpeService.getDpeByBan(input.plotBanId)) : Promise.resolve(null),
            urbanPermits: this.autorisationsService.getByParcelle(parcelId),
            plu: geometry && department ? this.fetchPlu(geometry, department) : Promise.resolve(null),
            buildings: geometry && department ? this.fetchBuildings(geometry, department) : Promise.resolve(null),
            risks: communeCode && department ? this.fetchRisks(communeCode, department) : Promise.resolve(null),
            climate: geometry && department ? this.fetchClimate(geometry, department) : Promise.resolve(null),
            proximity: geometry && ['Polygon', 'MultiPolygon'].includes(geometry.type)
                ? this.proximiteService.compute({ geometry: geometry as any, types: PROXIMITY_TYPES })
                : Promise.resolve(null),
        };

        const names = Object.keys(tasks);
        const settled = await Promise.allSettled(Object.values(tasks));
        const values: Record<string, any> = {};
        settled.forEach((result, index) => {
            const name = names[index];
            if (result.status === 'fulfilled') {
                values[name] = result.value;
                return;
            }
            values[name] = null;
            errors[name] = result.reason?.message ?? String(result.reason);
            this.logger.warn(`Enrichissement "${name}" échoué pour ${parcelId}: ${errors[name]}`);
        });

        return {
            communeCode,
            department,
            prefix: parcelProperties?.prefixe ?? null,
            section: parcelProperties?.section ?? null,
            parcelNumber: parcelProperties?.numero ?? null,
            surfaceM2: this.toNumber(parcelProperties?.contenance),
            centroidLongitude: centroid?.lon ?? null,
            centroidLatitude: centroid?.lat ?? null,
            cadastreProperties: parcelProperties ?? null,
            addressProperties: addressProperties ?? null,
            ...values,
            enrichedAt: new Date(),
            enrichmentErrors: Object.keys(errors).length ? errors : null,
        };
    }

    // "No data" (404) is a valid answer, not a failure.
    private async orNull<T>(promise: Promise<T>): Promise<T | null> {
        try {
            return await promise;
        } catch (error) {
            if (error instanceof NotFoundException)
                return null;
            throw error;
        }
    }

    private toNumber(value: unknown): number | null {
        const parsed = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
        return Number.isFinite(parsed) ? parsed : null;
    }

    private async localWfs(typeName: string, cqlFilter: string): Promise<any[]> {
        const baseUrl = this.configService.get<string>('EXTERNE_GEOSERVER_URL');
        if (!baseUrl)
            throw new Error('EXTERNE_GEOSERVER_URL non configurée.');

        const params = new URLSearchParams({
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typeName: typeName,
            outputFormat: 'application/json',
            srsName: 'EPSG:4326',
            CQL_FILTER: cqlFilter,
        });
        const response = await axios.get(`${baseUrl.replace(/\/$/, '')}/primo/wfs`, { params, timeout: WFS_TIMEOUT_MS });
        return response.data?.features ?? [];
    }

    // Layers published by the GPU: the national WFS is tried on the centroid, the local GeoServer is the fallback.
    private async fetchGpuLayer(geometry: Geometry, department: string, nationalLayer: string, localSuffix: string, propertyName?: string): Promise<any[]> {
        const center = this.centroid(geometry);
        if (center) {
            try {
                const params = new URLSearchParams({
                    service: 'WFS',
                    version: '2.0.0',
                    request: 'GetFeature',
                    typeName: nationalLayer,
                    outputFormat: 'application/json',
                    srsName: 'EPSG:4326',
                    CQL_FILTER: `INTERSECTS(the_geom,POINT(${center.lat} ${center.lon}))`,
                    ...(propertyName ? { propertyName } : {}),
                });
                const response = await axios.get(NATIONAL_WFS_URL, { params, timeout: WFS_TIMEOUT_MS });
                const features = response.data?.features ?? [];
                if (features.length > 0)
                    return features.map((f: any) => ({ properties: { ...f.properties, _source: 'NATIONAL_API' } }));
            } catch {
                // falls through to the local GeoServer
            }
        }

        const features = await this.localWfs(`primo:gpu_${department.padStart(2, '0')}_${localSuffix}`, `INTERSECTS(geom, SRID=4326;${this.toWkt(geometry, false)})`);
        return features.map((f: any) => ({ ...f, properties: { ...f.properties, _source: 'LOCAL_GEOSERVER' } }));
    }

    private async fetchPlu(geometry: Geometry, department: string) {
        const [zones, ...layers] = await Promise.all([
            this.fetchGpuLayer(geometry, department, 'wfs_du:zone_urba', 'zone_urba', 'partition,libelle,typezone,idurba,gpu_doc_id'),
            ...GPU_LAYERS.map(([, national, local]) => this.fetchGpuLayer(geometry, department, national, local)),
        ]);

        return {
            zones: zones,
            ...Object.fromEntries(GPU_LAYERS.map(([key], index) => [key, layers[index]])),
        };
    }

    // The building and climate layers expect "lat lng" axis order.
    private async fetchBuildings(geometry: Geometry, department: string) {
        return this.localWfs(`primo:batiment_${department}`, `INTERSECTS(geom, ${this.toWkt(geometry, true)})`);
    }

    private async fetchRisks(communeCode: string, department: string) {
        return this.localWfs(`primo:georisques_${department}`, `code_insee='${communeCode.replace(/[^0-9ABab]/g, '')}'`);
    }

    // Mean of every climate cell around the parcel, as in the climate widget.
    private async fetchClimate(geometry: Geometry, department: string) {
        const box = this.bbox(geometry, METEO_BBOX_MARGIN);
        const features = await this.localWfs(
            `primo:meteo_dept_${department}`,
            `BBOX(geom,${box.minLat},${box.minLng},${box.maxLat},${box.maxLng}) AND ${METEO_VALID_FILTER}`,
        );
        if (features.length === 0)
            return null;

        const average: Record<string, number> = {};
        for (const key of METEO_KEYS) {
            const sum = features.reduce((total, f) => total + (Number.isFinite(f.properties?.[key]) ? f.properties[key] : 0), 0);
            average[key] = Math.round((sum / features.length) * 100) / 100;
        }
        return { ...average, cellCount: features.length };
    }

    private firstCoordinate(geometry: Geometry): number[] | null {
        let coords: any = geometry.coordinates;
        while (Array.isArray(coords) && Array.isArray(coords[0]))
            coords = coords[0];
        return Array.isArray(coords) && coords.length >= 2 ? coords : null;
    }

    // First vertex, like the dashboard does: cheap and good enough to query a layer by point.
    private centroid(geometry: Geometry): { lon: number; lat: number } | null {
        const coords = this.firstCoordinate(geometry);
        return coords ? { lon: coords[0], lat: coords[1] } : null;
    }

    private bbox(geometry: Geometry, margin: number) {
        let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
        const walk = (node: any) => {
            if (typeof node[0] === 'number') {
                minLng = Math.min(minLng, node[0]);
                maxLng = Math.max(maxLng, node[0]);
                minLat = Math.min(minLat, node[1]);
                maxLat = Math.max(maxLat, node[1]);
            } else {
                node.forEach(walk);
            }
        };
        walk(geometry.coordinates);
        return { minLng: minLng - margin, maxLng: maxLng + margin, minLat: minLat - margin, maxLat: maxLat + margin };
    }

    private toWkt(geometry: Geometry, latFirst: boolean): string {
        const point = ([lng, lat]: number[]) => latFirst ? `${lat} ${lng}` : `${lng} ${lat}`;
        const ring = (r: number[][]) => `(${r.map(point).join(', ')})`;
        const polygon = (p: number[][][]) => `(${p.map(ring).join(', ')})`;

        if (geometry.type === 'Polygon')
            return `POLYGON${polygon(geometry.coordinates)}`;
        if (geometry.type === 'MultiPolygon')
            return `MULTIPOLYGON(${geometry.coordinates.map(polygon).join(', ')})`;
        if (geometry.type === 'Point')
            return `POINT(${point(geometry.coordinates)})`;
        throw new Error(`Type de géométrie non supporté: ${geometry.type}`);
    }
}
