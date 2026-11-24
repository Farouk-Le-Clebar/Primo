import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Map as MapIcon, MapPinPlus, SearchX } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import { ROUTES } from "../../../../constants/routes";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../../../requests/projects";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import type { ProjectResponse } from "../../../../types/project/projects";
import { useProjectPlots } from "../dashboard/useProjectData";
import ComparisonDialog from "./ComparisonDialog";
import ParcelDrawer from "./ParcelDrawer";
import ParcelsSummary from "./ParcelsSummary";
import ParcelsTable from "./ParcelsTable";
import ParcelsToolbar from "./ParcelsToolbar";
import { exportPlotsCsv } from "./exportPlots";
import { useParcelsFilters } from "./useParcelsFilters";
import { useParcelsSelection } from "./useParcelsSelection";

export default function ParcelsTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: plots = [], isPending } = useProjectPlots(projectId);
  const { data: project } = useQuery<ProjectResponse>({ queryKey: ["project", projectId], queryFn: () => getProjectById(projectId!), enabled: !!projectId });
  const filters = useParcelsFilters(plots);
  const selection = useParcelsSelection(projectId, plots);
  const navigate = useNavigate();
  const openId = searchParams.get("plot");
  const opened = plots.find((plot) => plot.id === openId) ?? null;

  const handleOpen = (id: string | null) => setSearchParams(id ? { plot: id } : {}, { replace: true });
  const handleExport = () => exportPlotsCsv(filters.visible, project?.name ?? "parcelles");
  const handleResetFilters = () => {
    filters.setFilter("all");
    filters.setQuery("");
  };
  const emptyState = plots.length === 0 ? (
    <EmptyState icon={MapPinPlus} title="Votre projet n’a pas encore de parcelle" description="Sélectionnez une parcelle sur la carte puis « Ajouter à un projet » : prix DVF, DPE, PLU et risques seront calculés automatiquement." action={{ label: "Ouvrir la carte", onClick: () => navigate(ROUTES.map), icon: MapIcon }} />
  ) : (
    <EmptyState icon={SearchX} title="Aucune parcelle ne correspond" description="Essayez un autre filtre ou une autre recherche." secondaryAction={{ label: "Réinitialiser les filtres", onClick: handleResetFilters }} size="sm" framed={false} />
  );

  if (isPending || !projectId)
    return <div className="primo-card h-[420px] animate-pulse motion-reduce:animate-none" />;

  return (
    <div className="flex flex-col gap-4">
      <ParcelsToolbar
        chips={filters.chips}
        filter={filters.filter}
        onFilterChange={filters.setFilter}
        query={filters.query}
        onQueryChange={filters.setQuery}
        compareCount={selection.comparePlots.length}
        onCompare={() => selection.setComparing(true)}
        onExport={handleExport}
      />
      <ParcelsTable
        plots={filters.visible}
        compareIds={selection.compareIds}
        sortKey={filters.sortKey}
        direction={filters.direction}
        onSort={filters.sortBy}
        onToggleCompare={selection.toggleCompare}
        onOpen={handleOpen}
        emptyState={emptyState}
      />
      <ParcelsSummary plots={plots} compareCount={selection.comparePlots.length} />
      {selection.comparing && selection.comparePlots.length === 2 && (
        <ComparisonDialog
          projectId={projectId}
          plots={selection.comparePlots as [ProjectPlotWithSummary, ProjectPlotWithSummary]}
          onClose={() => selection.setComparing(false)}
        />
      )}
      {opened && (
        <ParcelDrawer
          plot={opened}
          isDeleting={selection.isRemoving}
          onClose={() => handleOpen(null)}
          onShowOnMap={() => selection.showOnMap(opened)}
          onDelete={() => selection.removePlot(opened.id, () => handleOpen(null))}
        />
      )}
    </div>
  );
}
