import { Radar } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import SectionCard from "../ui/SectionCard";
import Tag from "../ui/Tag";
import { buildAroundEvents, formatAge } from "./aroundEvents";

const PREVIEW_COUNT = 3;

export default function OverviewAround({ plots }: { plots: ProjectPlotWithSummary[] }) {
  const events = buildAroundEvents(plots).slice(0, PREVIEW_COUNT);

  return (
    <SectionCard title="Autour de vos parcelles" subtitle="Ventes DVF, permis Sitadel et DPE de vos parcelles">
      <div className="mt-2 flex flex-col">
        {events.length === 0 && <EmptyState icon={Radar} title="Rien de nouveau autour de vos parcelles" description="Les ventes DVF, permis Sitadel et DPE F-G apparaîtront ici dès qu’une parcelle en a." size="sm" framed={false} />}
        {events.map(({ id, icon: Icon, iconTone, title, detail, tag, date }, index) => (
          <div key={id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in group flex items-center gap-3 border-t border-[#1c1c1e]/8 px-1 py-2.5 dark:border-white/8">
            <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] ${iconTone}`}>
              <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{title}</p>
              <p className="truncate text-xs text-[#82828c]">{detail}</p>
            </div>
            {tag && <Tag tone={tag.tone} size="sm">{tag.label}</Tag>}
            <p className="w-12 text-right text-xs font-medium text-[#82828c]">{formatAge(date)}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
