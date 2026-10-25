import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import { computeProximite } from "../../../../../../../requests/proximite";
import { DEFAULT_SORT_ORDER, DEFAULT_TYPES, NEXT_SORT_ORDER, type SortOrder } from "./constants";
import { extractResults, getErrorMessage, getParcelCache, indexResultsByType } from "./results";
import { computeGlobalScore, sortCodes, type ComputedResults, type FeatureLike } from "./utils";

export function usePoisProximity(feature: FeatureLike | undefined) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([...DEFAULT_TYPES]);
  const [computed, setComputed] = useState<ComputedResults>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [grayNotFound, setGrayNotFound] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const parcelKey = useMemo(() => (feature?.geometry ? JSON.stringify(feature.geometry) : null), [feature?.geometry]);
  const hasCalculated = computed.size > 0;
  const isUpToDate = hasCalculated && selectedTypes.every((code) => computed.has(code));

  useEffect(() => {
    abortRef.current?.abort();
    setComputed(new Map());
    setLoading(false);
    setError(null);
  }, [feature]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const visibleCodes = useMemo(() => selectedTypes.filter((code) => computed.has(code)), [selectedTypes, computed]);
  const displayedCodes = useMemo(
    () => sortCodes(visibleCodes, computed, sortOrder, grayNotFound),
    [visibleCodes, computed, sortOrder, grayNotFound],
  );
  const globalScore = useMemo(() => computeGlobalScore(visibleCodes, computed), [visibleCodes, computed]);

  const toggleType = useCallback((code: string) => {
    setSelectedTypes((current) => (current.includes(code) ? current.filter((item) => item !== code) : [...current, code]));
  }, []);

  const setTypes = useCallback((codes: string[], selected: boolean) => {
    setSelectedTypes((current) =>
      selected ? [...new Set([...current, ...codes])] : current.filter((code) => !codes.includes(code)),
    );
  }, []);

  const resetTypes = useCallback(() => setSelectedTypes([...DEFAULT_TYPES]), []);
  const clearTypes = useCallback(() => setSelectedTypes([]), []);
  const cycleSort = useCallback(() => setSortOrder((current) => NEXT_SORT_ORDER[current]), []);
  const toggleGrayNotFound = useCallback(() => setGrayNotFound((current) => !current), []);

  const calculate = useCallback(async () => {
    if (!feature?.geometry || !parcelKey) return setError("La géométrie de la parcelle est indisponible.");
    if (!selectedTypes.length) return setError("Sélectionnez au moins un type d’infrastructure.");

    const cache = getParcelCache(parcelKey);
    const typesToFetch = isUpToDate ? selectedTypes : selectedTypes.filter((code) => !cache.has(code));
    const publish = () => setComputed(new Map(selectedTypes.map((code) => [code, cache.get(code) ?? null])));

    setError(null);
    if (!typesToFetch.length) return publish();

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const data = await computeProximite(feature.geometry, typesToFetch, controller.signal);
      const fetched = indexResultsByType(extractResults(data));
      typesToFetch.forEach((code) => cache.set(code, fetched.get(code) ?? null));
      publish();
    } catch (err) {
      if (!axios.isCancel(err)) setError(getErrorMessage(err));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [feature, parcelKey, selectedTypes, isUpToDate]);

  return {
    selectedTypes,
    computed,
    loading,
    error,
    sortOrder,
    grayNotFound,
    hasCalculated,
    isUpToDate,
    displayedCodes,
    globalScore,
    toggleType,
    setTypes,
    resetTypes,
    clearTypes,
    cycleSort,
    toggleGrayNotFound,
    calculate,
  };
}

export type PoisProximityState = ReturnType<typeof usePoisProximity>;
