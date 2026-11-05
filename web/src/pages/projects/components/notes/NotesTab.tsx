import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import { createProjectNote, deleteProjectNote, getProjectNotes } from "../../../../requests/notes";
import type { ProjectNote } from "../../../../types/project/notes";
import NoteEditor from "./NoteEditor";

const notesQueryKey = (projectId?: string) => ["project", projectId, "notes"];

const noteLabel = (note: ProjectNote) => note.title.trim() || "Sans titre";

export default function NotesTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: notes, isPending } = useQuery({
    queryKey: notesQueryKey(projectId),
    queryFn: () => getProjectNotes(projectId!),
    enabled: !!projectId,
  });

  const selected = notes?.find((note) => note.id === selectedId) ?? notes?.[0] ?? null;

  // Keeps the list in sync with what the editor saved, without refetching (the editor owns the draft).
  const handleSaved = (saved: ProjectNote) => {
    queryClient.setQueryData<ProjectNote[]>(notesQueryKey(projectId), (current) =>
      current?.map((note) => (note.id === saved.id ? saved : note)));
  };

  const { mutate: createNote, isPending: isCreating } = useMutation({
    mutationFn: () => createProjectNote(projectId!),
    onSuccess: (created) => {
      queryClient.setQueryData<ProjectNote[]>(notesQueryKey(projectId), (current) => [created, ...(current ?? [])]);
      setSelectedId(created.id);
    },
    onError: (error: Error) => toast.error(error.message || "Impossible de créer la note."),
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: (noteId: string) => deleteProjectNote(projectId!, noteId),
    onSuccess: (_, noteId) => {
      queryClient.setQueryData<ProjectNote[]>(notesQueryKey(projectId), (current) => current?.filter((note) => note.id !== noteId));
      setSelectedId(null);
      toast.success("Note supprimée.");
    },
    onError: (error: Error) => toast.error(error.message || "Impossible de supprimer la note."),
  });

  if (isPending) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-64 shrink-0 flex-col border-r border-black/[0.06] dark:border-white/10">
        <div className="p-3">
          <button
            onClick={() => createNote()}
            disabled={isCreating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4" /> Nouvelle note
          </button>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {notes?.map((note) => (
            <li key={note.id}>
              <button
                onClick={() => setSelectedId(note.id)}
                className={`w-full rounded-lg px-3 py-2 text-left ${note.id === selected?.id ? "bg-black/[0.06] dark:bg-white/10" : "hover:bg-black/[0.03] dark:hover:bg-white/5"}`}
              >
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{noteLabel(note)}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {note.content.trim().slice(0, 60) || "Note vide"}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="min-w-0 flex-1">
        {selected ? (
          <NoteEditor
            key={selected.id}
            note={selected}
            onSaved={handleSaved}
            onDelete={() => deleteNote(selected.id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm italic text-gray-500 dark:text-gray-400">
            Aucune note pour ce projet. Créez-en une, elle sera enregistrée automatiquement.
          </div>
        )}
      </section>
    </div>
  );
}
