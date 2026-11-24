import { useState } from "react";
import { Car, Footprints, MapPin, MoreHorizontal } from "lucide-react";
import type { ProjectAddress } from "../../../../types/project/addresses";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import Avatar from "../ui/Avatar";
import Tag from "../ui/Tag";
import { TONES } from "../ui/palette";
import { plotTitle } from "../shared/plotInsights";
import { ADDRESS_CATEGORIES, formatMeters, nearestPlots } from "./addressMeta";

type AddressCardProps = { address: ProjectAddress; plots: ProjectPlotWithSummary[]; index: number; onDelete: () => void };

export default function AddressCard({ address, plots, index, onDelete }: AddressCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useOutsideClick(() => setMenuOpen(false));
  const category = ADDRESS_CATEGORIES[address.category ?? "autre"];
  const tone = TONES[category.tone];
  const Icon = category.icon;
  const [title, ...rest] = address.name ? [address.name, address.address] : address.address.split(/,(.+)/);
  const subtitle = address.name ? address.address : rest.join("").trim();
  const distances = nearestPlots(address, plots);

  return (
    <article style={{ animationDelay: `${index * 50}ms` }} className="primo-card animate-rise-in group flex flex-col gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-3">
        <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-8 group-hover:scale-110 ${tone.soft} ${tone.text}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{title.trim()}</p>
            {address.category && <Tag tone={category.tone}>{category.label}</Tag>}
          </div>
          {subtitle && <p className="truncate text-xs text-[#82828c]">{subtitle}</p>}
        </div>
        {address.createdByName && <Avatar name={address.createdByName} size="sm" />}
        <div ref={menuRef} className="relative">
          <button onClick={() => setMenuOpen((open) => !open)} aria-label="Actions" className="rounded-md p-1 text-[#82828c] transition-colors hover:bg-[#1c1c1e]/6 hover:text-[#1c1c1e] dark:hover:bg-white/8 dark:hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="animate-fade-in absolute right-0 top-7 z-20 w-40 rounded-lg border border-[#1c1c1e]/8 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#2c2c2e]">
              <button onClick={onDelete} className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-semibold text-red-500 hover:bg-red-500/8">Supprimer</button>
            </div>
          )}
        </div>
      </div>
      {address.description && <p className="line-clamp-2 text-xs text-[#52525b] dark:text-[#d4d4d8]">{address.description}</p>}
      {distances.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {distances.map(({ plot, meters, minutes, byCar }) => (
            <div key={plot.id} className="flex items-center gap-2 rounded-lg bg-[#1c1c1e]/4 px-2.5 py-2 text-xs dark:bg-white/5">
              <MapPin className="h-3 w-3 shrink-0 text-violet-500" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 truncate font-medium text-[#1c1c1e] dark:text-[#fafafa]">{plotTitle(plot)}</span>
              <span className="font-bold text-[#1c1c1e] tabular-nums dark:text-[#fafafa]">{formatMeters(meters)}</span>
              {byCar ? <Car className="h-3 w-3 shrink-0 text-[#82828c]" /> : <Footprints className="h-3 w-3 shrink-0 text-[#82828c]" />}
              <span className="shrink-0 text-[#82828c]">{minutes} min</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
