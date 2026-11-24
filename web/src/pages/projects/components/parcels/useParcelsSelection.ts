import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import L from "leaflet";
import { ROUTES } from "../../../../constants/routes";
import { deletePlotFromProject } from "../../../../requests/projects";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";

const COMPARE_COUNT = 2;

type RemoveError = { response?: { data?: { message?: string } } };

export function useParcelsSelection(projectId: string | undefined, plots: ProjectPlotWithSummary[]) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const { mutate, isPending: isRemoving } = useMutation({
    mutationFn: (plotId: string) => deletePlotFromProject(plotId),
    onSuccess: (_data, removedId) => {
      queryClient.invalidateQueries({ queryKey: ["projectPlots", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setCompareIds((ids) => ids.filter((id) => id !== removedId));
      toast.success("Parcelle supprimée du projet.");
    },
    onError: (error: RemoveError) => toast.error(error?.response?.data?.message ?? "Impossible de supprimer la parcelle."),
  });

  const comparePlots = compareIds
    .map((id) => plots.find((plot) => plot.id === id))
    .filter((plot): plot is ProjectPlotWithSummary => !!plot);

  const toggleCompare = (id: string) =>
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((current) => current !== id) : ids.length < COMPARE_COUNT ? [...ids, id] : [ids[1], id]));

  const removePlot = (id: string, onDone: () => void) => mutate(id, { onSuccess: onDone });

  const showOnMap = (plot: ProjectPlotWithSummary) => {
    const geometry = typeof plot.geometry === "string" ? JSON.parse(plot.geometry) : plot.geometry;
    const center = L.geoJSON(geometry).getBounds().getCenter();
    navigate(ROUTES.map, { state: { centerOn: [center.lat, center.lng] } });
  };

  return { compareIds, comparePlots, toggleCompare, comparing, setComparing, removePlot, isRemoving, showOnMap };
}
