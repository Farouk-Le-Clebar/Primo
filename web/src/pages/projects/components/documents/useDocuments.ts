import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteDocumentFromProject, getDocumentDownloadUrl, getDocumentsOfProject, updateDocumentMeta, uploadDocumentToProject } from "../../../../requests/projects";
import type { DocumentMeta, ProjectDocument } from "../../../../types/project/documents";
import type { FilterChip } from "../ui/FilterChips";
import { CATEGORY_LABELS, CATEGORY_ORDER, categoryOf, guessCategory, isNewDocument } from "./documentMeta";

export type DocumentFilter = "all" | "new" | ProjectDocument["category"] & string;

type RequestError = { message?: string };

export function useDocuments(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ["project", projectId, "documents"];
  const [filter, setFilter] = useState<DocumentFilter>("all");
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const { data: documents = [], isPending } = useQuery<ProjectDocument[]>({ queryKey, queryFn: () => getDocumentsOfProject(projectId!), enabled: !!projectId });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["project", projectId, "storage"] });
  };
  const onError = (error: RequestError) => toast.error(error?.message ?? "Action impossible");

  const upload = useMutation({
    mutationFn: (file: File) => uploadDocumentToProject(projectId!, file, setProgress, { category: guessCategory(file) }),
    onSuccess: () => {
      refresh();
      toast.success("Document déposé");
    },
    onError,
    onSettled: () => setProgress(null),
  });
  const remove = useMutation({ mutationFn: (id: string) => deleteDocumentFromProject(projectId!, id), onSuccess: refresh, onError });
  const updateMeta = useMutation({ mutationFn: ({ id, meta }: { id: string; meta: DocumentMeta }) => updateDocumentMeta(projectId!, id, meta), onSuccess: refresh, onError });

  const download = async (document: ProjectDocument) => {
    const url = await getDocumentDownloadUrl(projectId!, document.id);
    window.open(url, "_blank", "noopener");
  };

  const chips: FilterChip<DocumentFilter>[] = [
    { id: "all", label: "Tous", count: documents.length },
    { id: "new", label: "Nouveaux", count: documents.filter((document) => isNewDocument(document)).length, tone: "blue" },
    ...CATEGORY_ORDER.map((category) => ({ id: category, label: CATEGORY_LABELS[category], count: documents.filter((document) => categoryOf(document) === category).length })).filter((chip) => chip.count > 0),
  ];

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesFilter = filter === "all" || (filter === "new" ? isNewDocument(document) : categoryOf(document) === filter);
      return matchesFilter && document.documentName.toLowerCase().includes(needle);
    });
  }, [documents, filter, query]);

  return { documents, visible, isPending, chips, filter, setFilter, query, setQuery, upload, progress, remove, updateMeta, download };
}
