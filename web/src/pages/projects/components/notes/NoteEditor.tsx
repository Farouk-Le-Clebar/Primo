import { useRef, useState } from "react";
import Markdown from "react-markdown";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useAutosaveNote, type SaveStatus } from "../../../../hooks/useAutosaveNote";
import type { ProjectNote } from "../../../../types/project/notes";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import Avatar from "../ui/Avatar";
import Tag from "../ui/Tag";
import { plotTitle } from "../shared/plotInsights";
import NoteToolbar from "./NoteToolbar";
import { applyFormat, type NoteFormat } from "./noteFormatting";

type NoteEditorProps = {
  note: ProjectNote;
  plots: ProjectPlotWithSummary[];
  onSaved: (note: ProjectNote) => void;
  onDelete: () => void;
  onMeta: (meta: { isPinned?: boolean; plotId?: string | null }) => void;
};

const STATUS_LABELS: Record<SaveStatus, string> = { idle: "", dirty: "Modifié…", saving: "Enregistrement…", saved: "Enregistré", error: "Échec de l’enregistrement", conflict: "Conflit" };
const MARKDOWN = "text-sm leading-relaxed text-[#1c1c1e] dark:text-[#e4e4e7] [&_a]:underline [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:font-bold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5";

export default function NoteEditor({ note, plots, onSaved, onDelete, onMeta }: NoteEditorProps) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { title, content, setTitle, setContent, status, serverNote, acceptServerVersion, overwriteWithMine, retry } = useAutosaveNote(note, onSaved);
  const author = note.authorName ?? "Membre";

  const handleFormat = (format: NoteFormat) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { value, cursor } = applyFormat(textarea, format);
    setContent(value);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <section className="primo-card animate-rise-in flex min-h-[420px] flex-col p-6">
      <div className="flex items-center gap-2">
        <select value={note.plotId ?? ""} onChange={(event) => onMeta({ plotId: event.target.value || null })} className="max-w-[200px] cursor-pointer truncate rounded-full bg-violet-500/12 px-2.5 py-0.5 text-[11px] font-semibold text-violet-500 outline-none dark:bg-violet-500/20">
          <option value="">Toutes les parcelles</option>
          {plots.map((plot) => <option key={plot.id} value={plot.id}>{plotTitle(plot)}</option>)}
        </select>
        {note.isPinned && <Tag tone="zinc">Épinglée</Tag>}
        <span className="flex items-center gap-1.5 text-[11px] text-[#82828c]" aria-live="polite">
          {status === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
          {status === "saved" && <Check className="h-3 w-3 text-emerald-500" />}
          {(status === "error" || status === "conflict") && <AlertTriangle className="h-3 w-3 text-amber-500" />}
          {STATUS_LABELS[status]}
          {status === "error" && <button onClick={() => void retry()} className="font-semibold underline">Réessayer</button>}
        </span>
        <span className="flex-1" />
        <NoteToolbar preview={preview} isPinned={note.isPinned} onFormat={handleFormat} onTogglePreview={() => setPreview((value) => !value)} onTogglePin={() => onMeta({ isPinned: !note.isPinned })} onDelete={onDelete} />
      </div>
      {status === "conflict" && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          <span className="flex-1">Un autre membre a modifié cette note pendant que vous l’éditiez.</span>
          <button onClick={acceptServerVersion} disabled={!serverNote} className="font-semibold underline disabled:opacity-50">Charger leur version</button>
          <button onClick={overwriteWithMine} className="font-semibold underline">Garder la mienne</button>
        </div>
      )}
      <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} placeholder="Titre de la note" className="mt-5 bg-transparent text-2xl font-bold text-[#1c1c1e] outline-none placeholder:text-[#82828c]/60 dark:text-[#fafafa]" />
      <div className="mt-3 flex items-center gap-2 border-b border-[#1c1c1e]/8 pb-4 text-xs text-[#82828c] dark:border-white/8">
        <Avatar name={author} size="xs" />
        {author} · modifiée {formatRelativeTime(note.updatedAt).toLowerCase()}
      </div>
      {preview ? (
        <div className={`mt-4 flex-1 ${MARKDOWN}`}>{content.trim() ? <Markdown>{content}</Markdown> : <p className="italic text-[#82828c]">Note vide.</p>}</div>
      ) : (
        <textarea ref={textareaRef} value={content} onChange={(event) => setContent(event.target.value)} maxLength={50000} placeholder="Écrivez votre note… (Markdown pris en charge)" className="mt-4 min-h-[260px] flex-1 resize-none bg-transparent text-sm leading-relaxed text-[#1c1c1e] outline-none placeholder:text-[#82828c] dark:text-[#e4e4e7]" />
      )}
    </section>
  );
}
