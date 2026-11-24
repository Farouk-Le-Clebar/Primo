import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProjectNote, deleteProjectNote, updateProjectNoteMeta } from "../../../../requests/notes";
import type { ProjectNote } from "../../../../types/project/notes";
import { useProjectNews } from "../../../../hooks/useProjectNews";
import { useProjectNotes } from "../dashboard/useProjectData";
import type { FilterChip } from "../ui/FilterChips";

export type NoteFilter = "all" | "pinned" | "unread";

type RequestError = { message?: string };

export function useNotesTab(projectId: string | undefined, initialId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ["project", projectId, "notes"];
  const { data: notes = [], isPending } = useProjectNotes(projectId);
  const { projectActivity } = useProjectNews(projectId);
  const [filter, setFilter] = useState<NoteFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const unreadNoteIds = new Set(projectActivity.filter((item) => !item.isRead && item.metadata?.kind === "note").map((item) => item.metadata?.noteId));
  const onError = (error: RequestError) => toast.error(error?.message ?? "Action impossible");
  const patchCache = (updater: (current: ProjectNote[]) => ProjectNote[]) => queryClient.setQueryData<ProjectNote[]>(queryKey, (current) => updater(current ?? []));

  const create = useMutation({
    mutationFn: () => createProjectNote(projectId!),
    onSuccess: (created) => {
      patchCache((current) => [created, ...current]);
      setSelectedId(created.id);
    },
    onError,
  });
  const remove = useMutation({
    mutationFn: (noteId: string) => deleteProjectNote(projectId!, noteId),
    onSuccess: (_data, noteId) => {
      patchCache((current) => current.filter((note) => note.id !== noteId));
      setSelectedId(null);
      toast.success("Note supprimée");
    },
    onError,
  });
  const updateMeta = useMutation({
    mutationFn: ({ id, meta }: { id: string; meta: { isPinned?: boolean; plotId?: string | null } }) => updateProjectNoteMeta(projectId!, id, meta),
    onSuccess: (saved) => patchCache((current) => current.map((note) => (note.id === saved.id ? { ...note, isPinned: saved.isPinned, plotId: saved.plotId } : note))),
    onError,
  });

  const handleSaved = (saved: ProjectNote) => patchCache((current) => current.map((note) => (note.id === saved.id ? { ...note, ...saved } : note)));

  const chips: FilterChip<NoteFilter>[] = [
    { id: "all", label: "Toutes", count: notes.length },
    { id: "pinned", label: "Épinglées", count: notes.filter((note) => note.isPinned).length },
    { id: "unread", label: "Non lues", count: notes.filter((note) => unreadNoteIds.has(note.id)).length, tone: "amber" },
  ];
  const visible = notes.filter((note) => filter === "all" || (filter === "pinned" ? note.isPinned : unreadNoteIds.has(note.id)));
  const selected = notes.find((note) => note.id === selectedId) ?? visible[0] ?? null;

  return { notes, visible, isPending, chips, filter, setFilter, selected, setSelectedId, unreadNoteIds, create, remove, updateMeta, handleSaved };
}
