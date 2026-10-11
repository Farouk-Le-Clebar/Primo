import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import type { ParcelWidgetProps } from "../../types";
import {
    API_URL,
    DEFAULT_SORT_ORDER,
    DEFAULT_TYPES,
    NEXT_SORT_ORDER,
    type SortOrder,
} from "./constants";
import InfraCard, { InfraCardSkeleton } from "./InfraCard";
import InfraSelector from "./InfraSelector";
import ResultsToolbar from "./ResultsToolBar";
import {
    extractResults,
    getErrorMessage,
    getParcelCache,
    indexResultsByType,
    sortCodes,
    type ComputedResults,
    type FeatureLike,
} from "./utils";

const GRID_CLASS =
    "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

export default function PoisCard({ feature }: ParcelWidgetProps) {
    const currentFeature = feature as FeatureLike | undefined;
    const [selectedTypes, setSelectedTypes] = useState<string[]>([
        ...DEFAULT_TYPES,
    ]);
    const [computed, setComputed] = useState<ComputedResults>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
    const [grayNotFound, setGrayNotFound] = useState(true);
    const abortRef = useRef<AbortController | null>(null);

    const parcelKey = useMemo(
        () =>
            currentFeature?.geometry
                ? JSON.stringify(currentFeature.geometry)
                : null,
        [currentFeature?.geometry],
    );

    const hasCalculated = computed.size > 0;
    const isUpToDate =
        hasCalculated && selectedTypes.every((code) => computed.has(code));

    useEffect(() => {
        abortRef.current?.abort();
        setComputed(new Map());
        setLoading(false);
        setError(null);
    }, [currentFeature]);

    useEffect(() => () => abortRef.current?.abort(), []);

    const displayedCodes = useMemo(
        () =>
            sortCodes(
                selectedTypes.filter((code) => computed.has(code)),
                computed,
                sortOrder,
                grayNotFound,
            ),
        [selectedTypes, computed, sortOrder, grayNotFound],
    );

    const toggleType = useCallback((code: string) => {
        setSelectedTypes((current) =>
            current.includes(code)
                ? current.filter((item) => item !== code)
                : [...current, code],
        );
    }, []);

    const setTypes = useCallback((codes: string[], selected: boolean) => {
        setSelectedTypes((current) =>
            selected
                ? [...new Set([...current, ...codes])]
                : current.filter((code) => !codes.includes(code)),
        );
    }, []);

    const resetTypes = useCallback(() => setSelectedTypes([...DEFAULT_TYPES]), []);
    const clearTypes = useCallback(() => setSelectedTypes([]), []);
    const cycleSort = useCallback(
        () => setSortOrder((current) => NEXT_SORT_ORDER[current]),
        [],
    );
    const toggleGrayNotFound = useCallback(
        () => setGrayNotFound((current) => !current),
        [],
    );

    const calculateProximity = useCallback(async () => {
        if (!currentFeature?.geometry || !parcelKey) {
            setError("La géométrie de la parcelle est indisponible.");
            return;
        }
        if (selectedTypes.length === 0) {
            setError("Sélectionnez au moins un type d’infrastructure.");
            return;
        }

        const cache = getParcelCache(parcelKey);
        const typesToFetch = isUpToDate
            ? selectedTypes
            : selectedTypes.filter((code) => !cache.has(code));

        const publish = () =>
            setComputed(
                new Map(selectedTypes.map((code) => [code, cache.get(code) ?? null])),
            );

        setError(null);
        if (typesToFetch.length === 0) {
            publish();
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/proximite/compute`,
                { geometry: currentFeature.geometry, types: typesToFetch },
                {
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const fetched = indexResultsByType(extractResults(response.data));
            for (const code of typesToFetch) {
                cache.set(code, fetched.get(code) ?? null);
            }
            publish();
        } catch (err) {
            if (axios.isCancel(err)) return;
            setError(getErrorMessage(err));
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [currentFeature, parcelKey, selectedTypes, isUpToDate]);

    return (
        <div className="flex h-full min-h-[520px] w-full flex-col gap-5 rounded-xl bg-slate-50 p-4 md:p-6">

            <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-start">
                <InfraSelector
                    selectedTypes={selectedTypes}
                    loading={loading}
                    isUpToDate={isUpToDate}
                    canCalculate={Boolean(currentFeature?.geometry)}
                    error={error}
                    onToggleType={toggleType}
                    onSetTypes={setTypes}
                    onReset={resetTypes}
                    onClear={clearTypes}
                    onCalculate={calculateProximity}
                />

                <main className="min-w-0 flex-1">
                    {loading ? (
                        <div className={GRID_CLASS}>
                            {selectedTypes.map((code) => (
                                <InfraCardSkeleton key={code} />
                            ))}
                        </div>
                    ) : !hasCalculated ? (
                        <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                            <div>
                                <p className="font-medium text-slate-700">
                                    Découvrez les infrastructures à proximité
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Sélectionnez les types souhaités puis lancez
                                    le calcul.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ResultsToolbar
                                sortOrder={sortOrder}
                                onCycleSort={cycleSort}
                                grayNotFound={grayNotFound}
                                onToggleGrayNotFound={toggleGrayNotFound}
                            />
                            <div className={GRID_CLASS}>
                                {displayedCodes.map((code) => {
                                    const result = computed.get(code);
                                    return (
                                        <InfraCard
                                            key={code}
                                            code={code}
                                            result={result}
                                            muted={grayNotFound && !result}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}