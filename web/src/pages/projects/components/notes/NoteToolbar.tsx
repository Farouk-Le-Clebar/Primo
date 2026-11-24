import { useState } from "react";
import { Bold, CheckSquare, Eye, Italic, List, MoreHorizontal, Pencil, Pin, Trash } from "lucide-react";
import { useOutsideClick } from "../../../../hooks/useOutsideClick";
import type { NoteFormat } from "./noteFormatting";

type NoteToolbarProps = {
  preview: boolean;
  isPinned: boolean;
  onFormat: (format: NoteFormat) => void;
  onTogglePreview: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
};

const FORMATS: { format: NoteFormat; icon: typeof Bold; label: string }[] = [
  { format: "bold", icon: Bold, label: "Gras" },
  { format: "italic", icon: Italic, label: "Italique" },
  { format: "list", icon: List, label: "Liste" },
  { format: "task", icon: CheckSquare, label: "Case à cocher" },
];

const ICON_BUTTON = "rounded-md p-1.5 text-[#52525b] transition-all hover:bg-white hover:text-[#1c1c1e] hover:shadow-sm active:scale-90 disabled:opacity-40 dark:text-[#d4d4d8] dark:hover:bg-white/10 dark:hover:text-white";
const MENU_ITEM = "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium hover:bg-[#1c1c1e]/5 dark:hover:bg-white/8";

export default function NoteToolbar({ preview, isPinned, onFormat, onTogglePreview, onTogglePin, onDelete }: NoteToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useOutsideClick(() => setMenuOpen(false));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 rounded-lg bg-[#1c1c1e]/5 p-1 dark:bg-white/6">
        {FORMATS.map(({ format, icon: Icon, label }) => (
          <button key={format} onClick={() => onFormat(format)} disabled={preview} title={label} aria-label={label} className={ICON_BUTTON}>
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <div ref={menuRef} className="relative">
        <button onClick={() => setMenuOpen((open) => !open)} aria-label="Plus d’actions" className={ICON_BUTTON}>
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="animate-fade-in absolute right-0 top-8 z-20 w-48 rounded-lg border border-[#1c1c1e]/8 bg-white p-1 text-[#1c1c1e] shadow-lg dark:border-white/10 dark:bg-[#2c2c2e] dark:text-[#fafafa]">
            <button onClick={() => { onTogglePreview(); setMenuOpen(false); }} className={MENU_ITEM}>
              {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {preview ? "Modifier" : "Aperçu"}
            </button>
            <button onClick={() => { onTogglePin(); setMenuOpen(false); }} className={MENU_ITEM}>
              <Pin className="h-3.5 w-3.5" />
              {isPinned ? "Désépingler" : "Épingler"}
            </button>
            <button onClick={onDelete} className={`${MENU_ITEM} text-red-500`}>
              <Trash className="h-3.5 w-3.5" />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
