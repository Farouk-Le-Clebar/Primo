import { Link, useNavigate } from "react-router-dom";
import { Pin, StickyNote } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import type { ProjectNote } from "../../../../types/project/notes";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { formatRelativeTime } from "../../../../utils/relativeTime";
import SectionCard from "../ui/SectionCard";
import { plotTitle } from "../shared/plotInsights";

type OverviewNotesProps = { notes: ProjectNote[]; plots: ProjectPlotWithSummary[] };

const PREVIEW_COUNT = 3;

const excerpt = (note: ProjectNote): string =>
  (note.title || note.content.replace(/[#*_>`-]/g, " ")).replace(/\s+/g, " ").trim().slice(0, 140);

export default function OverviewNotes({ notes, plots }: OverviewNotesProps) {
  const navigate = useNavigate();
  const pinned = notes.filter((note) => note.isPinned);
  const shown = (pinned.length ? pinned : notes).slice(0, PREVIEW_COUNT);

  return (
    <SectionCard
      title={pinned.length ? "Notes épinglées" : "Notes récentes"}
      action={<Pin className="h-3.5 w-3.5 text-[#82828c]" strokeWidth={1.75} />}
    >
      <div className="mt-3 flex flex-col gap-2.5">
        {shown.length === 0 && <EmptyState icon={StickyNote} title="Aucune note" description="Notez un échange avec un vendeur ou une info de syndic : toute l’équipe la verra." action={{ label: "Écrire une note", onClick: () => navigate("../notes?new=1") }} size="sm" framed={false} />}
        {shown.map((note, index) => {
          const plot = plots.find((item) => item.id === note.plotId);
          const meta = [note.authorName, plot ? plotTitle(plot) : null, formatRelativeTime(note.updatedAt)].filter(Boolean);
          return (
            <Link
              key={note.id}
              to={`../notes?note=${note.id}`}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in flex flex-col gap-1.5 rounded-[10px] bg-amber-500/7 px-3 py-2.5 transition-colors hover:bg-amber-500/12 dark:bg-amber-500/12"
            >
              <p className="text-[13px] font-medium text-[#52525b] dark:text-[#d4d4d8]">« {excerpt(note) || "Note sans titre"} »</p>
              <p className="text-[11px] font-medium text-[#82828c]">{meta.join(" · ")}</p>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
