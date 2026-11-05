import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, Title } from "@tremor/react";
import { getProjectNotes } from "../../../../../requests/notes";

const PREVIEW_COUNT = 4;

export default function ProjectNotes() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: notes } = useQuery({
    queryKey: ["project", projectId, "notes"],
    queryFn: () => getProjectNotes(projectId!),
    enabled: !!projectId,
  });

  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex flex-col">
      <div className="border-b border-gray-100 dark:border-white/5 px-5 py-3 flex items-center justify-between gap-2">
        <Title className="text-sm font-semibold text-gray-900 dark:text-white">Notes</Title>
        <Link to="../notes" className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-[#999999] dark:hover:text-white">
          Tout voir
        </Link>
      </div>
      <div className="p-5 flex-1 text-xs text-gray-600 dark:text-[#999999] leading-relaxed">
        {notes && notes.length > 0 ? (
          <ul className="space-y-3">
            {notes.slice(0, PREVIEW_COUNT).map((note) => (
              <li key={note.id}>
                <p className="truncate font-medium text-gray-900 dark:text-white">{note.title.trim() || "Sans titre"}</p>
                <p className="line-clamp-2 whitespace-pre-wrap">{note.content.trim() || "Note vide"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center italic text-gray-500 dark:text-[#999999]">
            Aucune note renseignée.
          </div>
        )}
      </div>
    </Card>
  );
}
