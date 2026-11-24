import { useState } from "react";
import { MapPin, MoreHorizontal } from "lucide-react";
import type { DocumentCategory, ProjectDocument } from "../../../../types/project/documents";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import Avatar from "../ui/Avatar";
import Tag from "../ui/Tag";
import { TONES } from "../ui/palette";
import { shortName } from "../shared/plotInsights";
import { CATEGORY_LABELS, CATEGORY_ORDER, categoryOf, extensionOf, extensionTone, formatFileSize, isNewDocument } from "./documentMeta";

type DocumentRowProps = {
  document: ProjectDocument;
  plotLabel: string | null;
  selected: boolean;
  index: number;
  onSelect: () => void;
  onCategory: (category: DocumentCategory) => void;
  onDelete: () => void;
};

const MENU_ITEM = "w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-[#1c1c1e] hover:bg-[#1c1c1e]/5 dark:text-[#fafafa] dark:hover:bg-white/8";

export default function DocumentRow({ document, plotLabel, selected, index, onSelect, onCategory, onDelete }: DocumentRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useOutsideClick(() => setMenuOpen(false));
  const tone = TONES[extensionTone(document.documentName)];

  return (
    <div
      onClick={onSelect}
      style={{ animationDelay: `${index * 35}ms` }}
      className={`animate-rise-in group flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-2.5 transition-colors ${selected ? "border-blue-500/40 bg-blue-500/5" : "border-transparent hover:bg-[#1c1c1e]/[0.03] dark:hover:bg-white/[0.04]"}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className={`flex h-8 w-7 shrink-0 items-center justify-center rounded-[5px] text-[8px] font-bold transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tone.soft} ${tone.text}`}>{extensionOf(document.documentName)}</span>
        <p className="truncate text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{document.documentName}</p>
        {isNewDocument(document) && <Tag tone="blue">Nouveau</Tag>}
      </div>
      <span className="w-[100px] shrink-0"><Tag tone="zinc">{CATEGORY_LABELS[categoryOf(document)]}</Tag></span>
      <span className="flex w-[150px] shrink-0 items-center gap-1.5 truncate text-xs text-[#52525b] dark:text-[#d4d4d8]">
        <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.75} />
        {plotLabel ?? "Toutes"}
      </span>
      <span className="w-[68px] shrink-0 text-xs text-[#82828c]">{formatFileSize(document.size)}</span>
      <span className="flex w-[120px] shrink-0 items-center gap-2">
        {document.uploaderName && <Avatar name={document.uploaderName} size="xs" />}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{shortName(document.uploaderName)}</span>
          <span className="text-[11px] text-[#82828c]">{formatRelativeTime(document.createdAt)}</span>
        </span>
      </span>
      <div ref={menuRef} className="relative w-7 shrink-0" onClick={(event) => event.stopPropagation()}>
        <button onClick={() => setMenuOpen((open) => !open)} aria-label="Actions" className="rounded-md p-1 text-[#82828c] transition-colors hover:bg-[#1c1c1e]/6 hover:text-[#1c1c1e] dark:hover:bg-white/8 dark:hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="animate-fade-in absolute right-0 top-7 z-20 w-44 rounded-lg border border-[#1c1c1e]/8 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#2c2c2e]">
            {CATEGORY_ORDER.map((category) => (
              <button key={category} onClick={() => { onCategory(category); setMenuOpen(false); }} className={MENU_ITEM}>
                Classer dans {CATEGORY_LABELS[category].toLowerCase()}
              </button>
            ))}
            <div className="my-1 h-px bg-[#1c1c1e]/8 dark:bg-white/8" />
            <button onClick={onDelete} className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-semibold text-red-500 hover:bg-red-500/8">Supprimer</button>
          </div>
        )}
      </div>
    </div>
  );
}
