import { useState } from "react";
import Markdown from "react-markdown";
import { AlertTriangle, Check, Eye, Loader2, Pencil, Trash } from "lucide-react";
import { useAutosaveNote, type SaveStatus } from "../../../../hooks/useAutosaveNote";
import type { ProjectNote } from "../../../../types/project/notes";

const STATUS_LABELS: Record<SaveStatus, string> = {
  idle: "",
  dirty: "Modifications non enregistrées…",
  saving: "Enregistrement…",
  saved: "Enregistré",
  error: "Échec de l'enregistrement",
  conflict: "Conflit",
};

type Props = {
  note: ProjectNote;
  onSaved: (note: ProjectNote) => void;
  onDelete: () => void;
};

export default function NoteEditor({ note, onSaved, onDelete }: Props) {
  const [preview, setPreview] = useState(false);
  const { title, content, setTitle, setContent, status, serverNote, acceptServerVersion, overwriteWithMine, retry } = useAutosaveNote(note, onSaved);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-3 dark:border-white/10">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={255}
          placeholder="Titre de la note"
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
        />
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
          {status === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />}
          {status === "saved" && <Check className="h-3.5 w-3.5 text-emerald-500" />}
          {(status === "error" || status === "conflict") && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
          {STATUS_LABELS[status]}
        </span>
        {status === "error" && (
          <button onClick={() => void retry()} className="text-xs font-medium text-gray-900 underline dark:text-white">Réessayer</button>
        )}
        <button
          onClick={() => setPreview((value) => !value)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-black/[0.05] dark:text-gray-400 dark:hover:bg-white/10"
          title={preview ? "Modifier" : "Aperçu Markdown"}
        >
          {preview ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10"
          title="Supprimer la note"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      {status === "conflict" && (
        <div className="flex flex-wrap items-center gap-3 border-b border-amber-200 bg-amber-50 px-5 py-2.5 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="flex-1">Un autre membre a modifié cette note pendant que vous l'éditiez.</span>
          <button onClick={acceptServerVersion} disabled={!serverNote} className="font-semibold underline disabled:opacity-50">Charger leur version</button>
          <button onClick={overwriteWithMine} className="font-semibold underline">Écraser avec la mienne</button>
        </div>
      )}

      {preview ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-black/[0.05] [&_code]:px-1 dark:[&_code]:bg-white/10 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
          {content.trim() ? <Markdown>{content}</Markdown> : <p className="italic text-gray-500">Note vide.</p>}
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={50000}
          placeholder="Écrivez vos notes… (Markdown pris en charge)"
          className="min-h-0 flex-1 resize-none bg-transparent px-5 py-4 font-mono text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-200"
        />
      )}
    </div>
  );
}
