import { useEffect, useMemo, useState } from "react";
import { Card } from "@tremor/react";
import axios from "axios";
import type { ParcelWidgetProps } from "../../types";

/**
 * Codes are the `infrastructure_types.code` values expected by
 * POST /proximite/compute. Add/remove types here to adapt the catalogue.
 */
const INFRA_CATEGORIES = [
    {
        label: "Sports",
        types: [
            { code: "piscine_publique", label: "Piscine publique" },
            { code: "salle_de_sport", label: "Salle de sport" },
            { code: "terrain_de_tennis", label: "Terrain de tennis" },
        ],
    },
    {
        label: "Culture",
        types: [
            { code: "bibliotheque", label: "Bibliothèque" },
            { code: "cinema", label: "Cinéma" },
            { code: "musee", label: "Musée" },
        ],
    },
    {
        label: "Santé",
        types: [
            { code: "hopital", label: "Hôpital" },
            { code: "pharmacie", label: "Pharmacie" },
        ],
    },
    {
        label: "Commerces",
        types: [
            { code: "supermarche", label: "Supermarché" },
            { code: "centre_commercial", label: "Centre commercial" },
            { code: "epicerie", label: "Épicerie" },
            { code: "grand_magasin", label: "Grand magasin" },
        ],
    },
    {
        label: "Transports",
        types: [{ code: "gare", label: "Gare" }],
    },
    {
        label: "Environnement",
        types: [{ code: "parc", label: "Parc" }],
    },
];

const DEFAULT_TYPES = ["hopital", "pharmacie", "parc", "gare", "supermarche"];
const API_BASE_URL = (
    import.meta.env.VITE_API_URL ?? "https://api.primo-data.fr"
).replace(/\/$/, "");

// The circle uses the API score for its progress and its colour only.
function scoreColor(score: number): string {
    const stops = [
        { at: 0, color: [169, 0, 3] }, // #A90003
        { at: 25, color: [232, 117, 40] }, // orange
        { at: 50, color: [230, 194, 41] }, // yellow
        { at: 75, color: [154, 205, 50] }, // yellow-green
        { at: 100, color: [52, 199, 89] }, // #34C759
    ];
    const value = Math.max(0, Math.min(100, score));
    let lower = stops[0];
    let upper = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i += 1) {
        if (value >= stops[i].at && value <= stops[i + 1].at) {
            lower = stops[i];
            upper = stops[i + 1];
            break;
        }
    }
    const t = (value - lower.at) / (upper.at - lower.at || 1);
    const rgb = lower.color.map((channel, i) =>
        Math.round(channel + (upper.color[i] - channel) * t),
    );
    return `rgb(${rgb.join(",")})`;
}

function formatDistance(distance: number | null | undefined): string {
    if (distance == null || !Number.isFinite(Number(distance))) return "—";
    const metres = Number(distance);
    if (metres < 1000) return `${Math.round(metres)}m`;
    return `${(metres / 1000).toFixed(1)}km`;
}

type ProximityResult = {
    type_code?: string;
    code?: string;
    type_label?: string;
    categorie?: string;
    label?: string;
    nom?: string | null;
    name?: string | null;
    adresse?: string | null;
    address?: string | null;
    famille?: string | null;
    family?: string | null;
    distance_m?: number | null;
    distance?: number | null;
    score?: number | null;
};

type FeatureLike = {
    geometry?: { type?: string; coordinates?: unknown };
    properties?: Record<string, unknown>;
};

function getResultType(result: ProximityResult) {
    return result.type_code ?? result.code ?? "";
}

export default function PoisCard({ feature }: ParcelWidgetProps) {
    const currentFeature = feature as FeatureLike | undefined;
    const [selectedTypes, setSelectedTypes] = useState<string[]>([
        ...DEFAULT_TYPES,
    ]);
    const [expanded, setExpanded] = useState<string[]>(["Sports"]);
    const [results, setResults] = useState<ProximityResult[]>([]);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const properties = currentFeature?.properties ?? {};
    const parcelNumber =
        [properties.section, properties.numero].filter(Boolean).join(" ") ||
        String(properties.id ?? "Parcelle sélectionnée");
    const address = String(
        properties.addok_label ??
            properties.adresse ??
            "Adresse non renseignée",
    );
    const selectedCount = selectedTypes.length;

    // If the selected parcel changes, never show the previous parcel's results.
    useEffect(() => {
        setResults([]);
        setHasCalculated(false);
        setError(null);
    }, [currentFeature]);

    const resultByType = useMemo(() => {
        const map = new Map<string, ProximityResult>();
        for (const result of results) {
            const code = getResultType(result);
            if (code) map.set(code, result);
        }
        return map;
    }, [results]);

    function toggleType(code: string) {
        setSelectedTypes((current) =>
            current.includes(code)
                ? current.filter((item) => item !== code)
                : [...current, code],
        );
    }

    function toggleCategory(label: string) {
        setExpanded((current) =>
            current.includes(label)
                ? current.filter((item) => item !== label)
                : [...current, label],
        );
    }

    async function calculateProximity() {
        if (!currentFeature?.geometry) {
            setError("La géométrie de la parcelle est indisponible.");
            return;
        }
        if (selectedTypes.length === 0) {
            setError("Sélectionnez au moins un type d’infrastructure.");
            return;
        }

        setLoading(true);
        setError(null);

        console.log("Geometry envoyée :", feature?.geometry);
        console.log("Type :", feature?.geometry?.type);
        console.log(
            "Nombre de coordonnées :",
            feature?.geometry
        );

        try {
            const { data: payload } = await axios.post(
                `${API_BASE_URL}/proximite/compute`,
                { geometry: currentFeature.geometry, types: selectedTypes },
                { headers: { "Content-Type": "application/json" } },
            );
            // Accept either a raw array or a common { results: [...] } response envelope.
            const nextResults: ProximityResult[] = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.results)
                  ? payload.results
                  : Array.isArray(payload?.data)
                    ? payload.data
                    : [];
            setResults(nextResults);
            setHasCalculated(true);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const detail =
                    typeof err.response?.data?.message === "string"
                        ? err.response.data.message
                        : err.message;
                setError(
                    status
                        ? `Erreur API (${status}) : ${detail}`
                        : `API inaccessible : ${detail}`,
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Impossible de calculer les proximités.",
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-full min-h-[520px] w-full flex-col gap-5 rounded-xl bg-slate-50 p-4 md:flex-row md:p-6">
            <aside className="w-full shrink-0 md:w-56 lg:w-64">
                <div className="mb-6 space-y-1">
                    <p className="text-xs text-slate-500">
                        Parcelle {parcelNumber}
                    </p>
                    <h2 className="text-xl font-semibold text-slate-950">
                        Environnement
                    </h2>
                    <p className="text-sm text-slate-500">{address}</p>
                </div>

                <div className="mb-3">
                    <h3 className="text-base font-semibold text-slate-950">
                        Vos points d’intérêts
                    </h3>
                    <p className="mt-1 text-xs text-emerald-700">
                        ● {selectedCount} sélectionné
                        {selectedCount > 1 ? "s" : ""}
                    </p>
                </div>

                <div className="divide-y divide-slate-200 border-b border-slate-200">
                    {INFRA_CATEGORIES.map((category) => {
                        const isExpanded = expanded.includes(category.label);
                        const categoryCodes = category.types.map(
                            (item) => item.code as string,
                        );
                        const selectedInCategory = categoryCodes.filter(
                            (code) => selectedTypes.includes(code),
                        ).length;
                        const allSelected =
                            categoryCodes.length > 0 &&
                            selectedInCategory === categoryCodes.length;
                        return (
                            <section key={category.label} className="py-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        aria-label={`Sélectionner toute la catégorie ${category.label}`}
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(element) => {
                                            if (element)
                                                element.indeterminate =
                                                    selectedInCategory > 0 &&
                                                    !allSelected;
                                        }}
                                        onChange={() => {
                                            setSelectedTypes((current) =>
                                                allSelected
                                                    ? current.filter(
                                                          (code) =>
                                                              !categoryCodes.includes(
                                                                  code,
                                                              ),
                                                      )
                                                    : [
                                                          ...new Set([
                                                              ...current,
                                                              ...categoryCodes,
                                                          ]),
                                                      ],
                                            );
                                        }}
                                        className="h-3.5 w-3.5 accent-emerald-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleCategory(category.label)
                                        }
                                        className="flex flex-1 items-center justify-between py-1 text-left text-sm text-slate-600"
                                    >
                                        <span>{category.label}</span>
                                        <span className="text-slate-500">
                                            {isExpanded ? "⌄" : "›"}
                                        </span>
                                    </button>
                                </div>
                                {isExpanded && (
                                    <div className="ml-5 mt-1 space-y-2 pb-1">
                                        {category.types.map((type) => (
                                            <label
                                                key={type.code}
                                                className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(
                                                        type.code,
                                                    )}
                                                    onChange={() =>
                                                        toggleType(type.code)
                                                    }
                                                    className="h-3.5 w-3.5 accent-emerald-600"
                                                />
                                                {type.label}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={calculateProximity}
                    disabled={
                        loading ||
                        !currentFeature?.geometry ||
                        selectedCount === 0
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {loading
                        ? "Calcul en cours…"
                        : hasCalculated
                          ? "Recalculer la proximité"
                          : "Calculer la proximité"}
                </button>
                {error && (
                    <p
                        role="alert"
                        className="mt-3 break-words text-xs text-red-700"
                    >
                        {error}
                    </p>
                )}
            </aside>

            <main className="min-w-0 flex-1">
                {!hasCalculated && !loading ? (
                    <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <div>
                            <p className="font-medium text-slate-700">
                                Découvrez les infrastructures à proximité
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Sélectionnez les types souhaités puis lancez le
                                calcul.
                            </p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="flex h-full min-h-64 items-center justify-center text-sm text-slate-500">
                        Recherche des infrastructures à proximité…
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {selectedTypes.map((code) => {
                            const result = resultByType.get(code);
                            const configuredType = INFRA_CATEGORIES.flatMap(
                                (category) => category.types,
                            ).find((type) => type.code === code);
                            const title =
                                result?.type_label ??
                                result?.categorie ??
                                result?.label ??
                                configuredType?.label ??
                                code;
                            const name = result?.nom ?? result?.name ?? null;
                            const family =
                                result?.famille ??
                                result?.family ??
                                INFRA_CATEGORIES.find((category) =>
                                    category.types.some(
                                        (type) => type.code === code,
                                    ),
                                )?.label ??
                                "Infrastructure";
                            const distance =
                                result?.distance_m ?? result?.distance ?? null;
                            const score = Math.max(
                                0,
                                Math.min(100, Number(result?.score ?? 0)),
                            );
                            const color = scoreColor(score);
                            return (
                                <Card
                                    key={code}
                                    className="flex min-h-40 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    <h4 className="text-sm font-medium text-slate-800">
                                        {title}
                                    </h4>
                                    <p
                                        className="mt-0.5 min-h-5 truncate text-sm text-slate-500"
                                        title={name ?? undefined}
                                    >
                                        {name ??
                                            (hasCalculated
                                                ? "Aucune infrastructure trouvée"
                                                : "En attente du calcul")}
                                    </p>
                                    <div className="mt-2 self-start rounded-md bg-black px-2 py-1 text-[10px] font-medium text-white">
                                        {family}
                                    </div>
                                    <div className="flex flex-1 items-center justify-center py-3">
                                        <div
                                            role="img"
                                            aria-label={`Distance ${formatDistance(distance)}, indice de proximité ${score}%`}
                                            title={`Indice de proximité : ${score}%`}
                                            className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full"
                                            style={{
                                                background: `conic-gradient(${color} ${score * 3.6}deg, #e5e7eb 0deg)`,
                                            }}
                                        >
                                            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white">
                                                <span className="whitespace-nowrap text-xs font-semibold text-slate-900">
                                                    {formatDistance(distance)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
