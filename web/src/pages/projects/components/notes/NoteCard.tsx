import { MapPin, Pin } from "lucide-react";
import type { ProjectNote } from "../../../../types/project/notes";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import Avatar from "../ui/Avatar";
import Tag from "../ui/Tag";

type NoteCardProps = {
  note: ProjectNote;
  plotLabel: string | null;
  selected: boolean;
  isUnread: boolean;
  index: number;
  onSelect: () => void;
};

const excerptOf = (content: string): string => content.replace(/[#*_>`[\]-]/g, " ").replace(/\s+/g, " ").trim();

export default function NoteCard({ note, plotLabel, selected, isUnread, index, onSelect }: NoteCardProps) {
  const author = note.authorName ?? "Membre";

  return (
    <button
      onClick={onSelect}
      style={{ animationDelay: `${index * 40}ms` }}
      className={`animate-rise-in flex w-full flex-col gap-2 rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected ? "border-amber-400 bg-amber-500/10 shadow-[0_2px_12px_rgba(245,158,11,0.12)]" : "primo-card"}`}
    >
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-bold text-[#1c1c1e] dark:text-[#fafafa]">{note.title.trim() || "Sans titre"}</p>
        {isUnread && <Tag tone="amber">Nouveau</Tag>}
        <span className="flex-1" />
        {note.isPinned && <Pin className="h-3.5 w-3.5 shrink-0 text-[#82828c]" strokeWidth={1.75} />}
      </div>
      <p className="line-clamp-2 text-xs text-[#52525b] dark:text-[#d4d4d8]">{excerptOf(note.content) || "Note vide"}</p>
      <div className="flex items-center gap-2 text-[11px] text-[#82828c]">
        <Avatar name={author} size="xs" />
        <span className="truncate">{author} · {formatRelativeTime(note.updatedAt)}</span>
        <span className="flex-1" />
        <span className="flex shrink-0 items-center gap-1 truncate">
          <MapPin className="h-3 w-3" strokeWidth={1.75} />
          {plotLabel ?? "Toutes les parcelles"}
        </span>
      </div>
    </button>
  );
}
