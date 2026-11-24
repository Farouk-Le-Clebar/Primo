import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Map as MapIcon, MapPin, MapPinPlus } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import { ROUTES } from "../../../../constants/routes";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import SectionCard from "../ui/SectionCard";
import DpeBadge from "../ui/DpeBadge";
import Tag from "../ui/Tag";
import { formatEuros, isNewPlot, plotTitle, pricePerM2, vigilanceTags } from "../shared/plotInsights";

const PREVIEW_COUNT = 4;
const HEAD = "text-[11px] font-medium text-[#82828c]";

export default function OverviewPlots({ plots }: { plots: ProjectPlotWithSummary[] }) {
  const navigate = useNavigate();
  const preview = plots.slice(0, PREVIEW_COUNT);

  return (
    <SectionCard
      title="Parcelles du projet"
      subtitle="Prix, énergie et vigilance en un coup d’œil"
      action={
        <Link to="../plots" className="group flex items-center gap-1 text-xs font-semibold text-[#1c1c1e] dark:text-[#fafafa]">
          Tout voir <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      }
    >
      <div className="mt-2 flex items-center gap-3 border-b border-[#1c1c1e]/8 px-2 pb-2.5 pt-1.5 dark:border-white/8">
        <span className={`flex-1 ${HEAD}`}>Adresse</span>
        <span className={`w-[110px] ${HEAD}`}>Prix €/m²</span>
        <span className={`w-[50px] ${HEAD}`}>DPE</span>
        <span className={`w-[170px] ${HEAD}`}>Vigilance</span>
        <span className="w-[80px]" />
      </div>
      {preview.length === 0 && <div className="mt-1"><EmptyState icon={MapPinPlus} title="Aucune parcelle dans ce projet" description="Cliquez une parcelle sur la carte puis « Ajouter à un projet » pour la retrouver ici avec ses prix, son DPE et ses risques." action={{ label: "Ouvrir la carte", onClick: () => navigate(ROUTES.map), icon: MapIcon }} size="sm" framed={false} /></div>}
      {preview.map((plot, index) => {
        const tags = vigilanceTags(plot);
        const details = [plot.plotId, plot.surfaceM2 ? `${plot.surfaceM2.toLocaleString("fr-FR")} m²` : null, plot.summary?.plu?.zones[0]].filter(Boolean);
        return (
          <Link
            key={plot.id}
            to={`../plots?plot=${plot.id}`}
            style={{ animationDelay: `${index * 40}ms` }}
            className="animate-fade-in group flex items-center gap-3 border-b border-[#1c1c1e]/8 px-2 py-2.5 transition-colors last:border-b-0 hover:bg-[#1c1c1e]/[0.025] dark:border-white/8 dark:hover:bg-white/[0.03]"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-violet-500/12 dark:bg-violet-500/20">
                <MapPin className="h-[15px] w-[15px] text-violet-500" strokeWidth={1.75} />
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{plotTitle(plot)}</p>
                  {isNewPlot(plot) && <Tag tone="violet">Nouveau</Tag>}
                </div>
                <p className="truncate text-[11px] text-[#82828c]">{details.join(" · ")}</p>
              </div>
            </div>
            <p className="w-[110px] text-[13px] font-semibold text-[#1c1c1e] tabular-nums dark:text-[#fafafa]">{formatEuros(pricePerM2(plot))}</p>
            <span className="w-[50px]"><DpeBadge label={plot.summary?.dpe?.lastLabel} size="md" /></span>
            <span className="flex w-[170px] gap-1">{tags.length ? tags.slice(0, 2).map((tag) => <Tag key={tag.label} tone={tag.tone} size="sm">{tag.label}</Tag>) : <span className="text-[13px] text-[#82828c]">—</span>}</span>
            <span className="w-[80px] text-right text-xs font-semibold text-[#52525b] transition-colors group-hover:text-[#1c1c1e] dark:text-[#d4d4d8] dark:group-hover:text-white">Ouvrir</span>
          </Link>
        );
      })}
    </SectionCard>
  );
}
