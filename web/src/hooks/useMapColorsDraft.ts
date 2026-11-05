import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DEFAULT_MAP_COLORS, MAP_COLOR_PRESETS } from "../constants/mapColorPresets";
import { resetMapColors, updateMapColors } from "../requests/mapColors";
import type { ColorMode, MapColorPreset, MapColors, ParcelColors, ParcelState } from "../types/mapColors";
import { isSameMapColors } from "../utils/mapColors";
import { MAP_COLORS_QUERY_KEY, useMapColors } from "./useMapColors";
import { useResolvedTheme } from "./useResolvedTheme";

export function useMapColorsDraft() {
  const queryClient = useQueryClient();
  const { colors: saved, isLoading, isError } = useMapColors();
  const resolvedMode = useResolvedTheme();
  const [edits, setEdits] = useState<MapColors | null>(null);
  const [selectedMode, setSelectedMode] = useState<ColorMode | null>(null);

  const draft = edits ?? saved;
  const mode = selectedMode ?? resolvedMode;
  const isDirty = !isSameMapColors(draft, saved);
  const isDefault = !isDirty && isSameMapColors(saved, DEFAULT_MAP_COLORS);
  const presetId = MAP_COLOR_PRESETS.find((preset) => isSameMapColors(preset.colors, draft))?.id ?? null;

  const applySaved = (colors: MapColors) => {
    queryClient.setQueryData(MAP_COLORS_QUERY_KEY, colors);
    setEdits(null);
  };

  const saveMutation = useMutation({
    mutationFn: updateMapColors,
    onSuccess: (colors) => {
      applySaved(colors);
      toast.success("Couleurs enregistrées.");
    },
    onError: () => {
      toast.error("Enregistrement impossible. Vos modifications sont conservées, réessayez.");
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetMapColors,
    onSuccess: (colors) => {
      applySaved(colors);
      toast.success("Couleurs réinitialisées.");
    },
    onError: () => {
      toast.error("Réinitialisation impossible. Réessayez plus tard.");
    },
  });

  const updateState = (state: ParcelState, patch: Partial<ParcelColors>) => {
    setEdits((current) => {
      const base = current ?? saved;
      return { ...base, [mode]: { ...base[mode], [state]: { ...base[mode][state], ...patch } } };
    });
  };

  const exit = () => {
    setEdits(null);
    setSelectedMode(null);
  };

  return {
    draft,
    mode,
    presetId,
    isDirty,
    isDefault,
    isLoading,
    isError,
    isSaving: saveMutation.isPending,
    isResetting: resetMutation.isPending,
    setMode: setSelectedMode,
    updateState,
    applyPreset: (preset: MapColorPreset) => setEdits(preset.colors),
    discard: () => setEdits(null),
    save: () => saveMutation.mutate(draft),
    reset: () => resetMutation.mutate(),
    exit,
  };
}

export type MapColorsDraft = ReturnType<typeof useMapColorsDraft>;
