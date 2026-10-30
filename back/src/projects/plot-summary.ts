import { ProjectPlots } from '../database/project-plots.entity';

type Row = Record<string, any>;

const DPE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const NEAREST_COUNT = 3;

const asText = (value: unknown): string | null =>
    typeof value === 'string' && value.trim() && value !== 'na' ? value.trim() : null;

const asNumber = (value: unknown): number | null => {
    const parsed = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
    return Number.isFinite(parsed) ? parsed : null;
};

const asDate = (value: unknown): string | null => {
    const raw = asText(value instanceof Date ? value.toISOString() : value)?.slice(0, 10);
    return raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
};

const latest = <T>(rows: T[], dateOf: (row: T) => string | null): T | null =>
    rows.filter(row => dateOf(row)).sort((a, b) => dateOf(b)!.localeCompare(dateOf(a)!))[0] ?? null;

const parseJsonRows = (value: unknown): Row[] => {
    try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

function summarizeDvf(dvf: Row | null) {
    if (!dvf)
        return null;
    const sales: Row[] = dvf.historique ?? [];
    const last = latest(sales, sale => asDate(sale.date_mutation));
    return {
        count: sales.length,
        lastDate: last ? asDate(last.date_mutation) : null,
        lastValue: last ? asNumber(last.valeur_fonciere) : null,
        lastNature: last ? asText(last.nature_mutation) : null,
        lastLocalType: last ? asText(last.type_local) : null,
    };
}

function summarizeDpe(dpe: Row[] | null) {
    if (!dpe)
        return null;
    const last = latest(dpe, d => asDate(d.date_etablissement_dpe));
    const distribution = Object.fromEntries(DPE_LABELS.map(label => [
        label,
        dpe.filter(d => asText(d.etiquette_dpe)?.toUpperCase() === label).length,
    ]));
    return {
        count: dpe.length,
        distribution,
        lastLabel: last ? asText(last.etiquette_dpe)?.toUpperCase() ?? null : null,
        lastGes: last ? asText(last.etiquette_ges)?.toUpperCase() ?? null : null,
        lastDate: last ? asDate(last.date_etablissement_dpe) : null,
        lastSurface: last ? asNumber(last.surface_habitable_logement) : null,
        constructionYear: last ? asNumber(last.annee_construction) : null,
    };
}

function summarizePermits(permits: Row[] | null) {
    if (!permits)
        return null;
    const last = latest(permits, p => asDate(p.date_reelle_autorisation));
    return {
        count: permits.length,
        lastDate: last ? asDate(last.date_reelle_autorisation) : null,
        lastType: last ? asText(last.type_autorisation) : null,
        lastState: last ? asText(last.etat_autorisation) : null,
    };
}

function summarizePlu(plu: Row | null) {
    if (!plu)
        return null;
    const zones: Row[] = (plu.zones ?? []).map((f: Row) => f.properties ?? {});
    const count = (key: string) => (plu[key] ?? []).length;
    return {
        zones: [...new Set(zones.map(z => asText(z.libelle) ?? asText(z.typezone)).filter(Boolean))] as string[],
        zoneType: asText(zones[0]?.typezone),
        description: asText(zones[0]?.libelong),
        prescriptions: count('prescriptionsSurf') + count('prescriptionsLin') + count('prescriptionsPct'),
        informations: count('informationsSurf') + count('informationsLin') + count('informationsPct'),
    };
}

// Mirrors the dashboard: top-level GASPAR risks of the commune, plus seismic zone and radon class.
function summarizeRisks(risks: Row[] | null) {
    const properties = risks?.[0]?.properties;
    if (!properties)
        return null;
    const rows = parseJsonRows(properties.risques_json);
    const codeOf = (row: Row) => asText(row.code) ?? '';
    const parents = rows.filter(row => codeOf(row).length === 2);
    const names = rows
        .filter(row => !parents.some(parent => codeOf(row).length > 2 && codeOf(row).startsWith(codeOf(parent))))
        .map(row => asText(row.libelle))
        .filter(Boolean) as string[];
    const radon = properties.statut_radon === 'donnee_indisponible' ? null
        : properties.classe_radon != null ? `Classe ${properties.classe_radon}`
            : asText(properties.classes_radon) ? `Classes ${properties.classes_radon}` : null;
    return {
        commune: asText(properties.nom_commune),
        count: names.length,
        names: names,
        seismicZone: asText(properties.zone_sismicite),
        radon: radon,
        catnatCount: parseJsonRows(properties.catnat_json).length,
    };
}

function summarizeClimate(climate: Row | null) {
    if (!climate)
        return null;
    return {
        meanTemperature: asNumber(climate.temp_moy_annuelle),
        summerMaxTemperature: asNumber(climate.temp_max_ete),
        winterMinTemperature: asNumber(climate.temp_min_hiver),
        annualPrecipitation: asNumber(climate.prec_annuelles),
    };
}

function summarizeProximity(proximity: Row[] | null) {
    if (!proximity)
        return null;
    const found = proximity.filter(item => item.distance_m != null);
    const nearest = [...found].sort((a, b) => a.distance_m - b.distance_m).slice(0, NEAREST_COUNT);
    return {
        requested: proximity.length,
        found: found.length,
        averageScore: proximity.length ? Math.round(proximity.reduce((sum, item) => sum + (item.score ?? 0), 0) / proximity.length) : null,
        nearest: nearest.map(item => ({
            label: asText(item.label) ?? asText(item.requested_type),
            name: asText(item.nom),
            distanceM: Math.round(item.distance_m),
        })),
    };
}

// Compact digest of everything stored for a parcel: small enough to ship for dozens of parcels at once.
export function buildPlotSummary(plot: ProjectPlots) {
    return {
        dvf: summarizeDvf(plot.dvf),
        dpe: summarizeDpe(plot.dpe),
        permits: summarizePermits(plot.urbanPermits),
        plu: summarizePlu(plot.plu),
        buildings: plot.buildings ? { count: plot.buildings.length } : null,
        risks: summarizeRisks(plot.risks),
        climate: summarizeClimate(plot.climate),
        proximity: summarizeProximity(plot.proximity),
    };
}
