import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Plus, SearchX, StickyNote } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import FilterChips from "../ui/FilterChips";
import { useProjectPlots } from "../dashboard/useProjectData";
import { plotTitle } from "../shared/plotInsights";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import { useNotesTab } from "./useNotesTab";

export default function NotesTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const createdFromLink = useRef(false);
  const tab = useNotesTab(projectId, searchParams.get("note"));
  const { data: plots = [] } = useProjectPlots(projectId);
  const plotLabel = (plotId: string | null) => {
    const plot = plots.find((item) => item.id === plotId);
    return plot ? plotTitle(plot) : null;
  };

  useEffect(() => {
    if (tab.isPending || createdFromLink.current || searchParams.get("new") !== "1") return;
    createdFromLink.current = true;
    tab.create.mutate();
    setSearchParams({}, { replace: true });
  }, [tab.isPending, tab.create, searchParams, setSearchParams]);

  if (tab.isPending) return <div className="primo-card h-[420px] animate-pulse motion-reduce:animate-none" />;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[345px_minmax(0,1fr)]">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <FilterChips chips={tab.chips} active={tab.filter} onChange={tab.setFilter} layoutId="note-filters" />
          <span className="flex-1" />
          <button onClick={() => tab.create.mutate()} disabled={tab.create.isPending} aria-label="Nouvelle note" className="group flex h-7 w-7 items-center justify-center rounded-lg bg-[#1c1c1e] text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 dark:bg-white dark:text-[#1c1c1e]">
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
        {tab.visible.length === 0 && tab.notes.length > 0 && <EmptyState icon={SearchX} title="Aucune note pour ce filtre" size="sm" secondaryAction={{ label: "Voir toutes les notes", onClick: () => tab.setFilter("all") }} />}
        {tab.visible.map((note, index) => (
          <NoteCard
            key={note.id}
            note={note}
            index={index}
            plotLabel={plotLabel(note.plotId)}
            selected={tab.selected?.id === note.id}
            isUnread={tab.unreadNoteIds.has(note.id)}
            onSelect={() => tab.setSelectedId(note.id)}
          />
        ))}
      </div>
      {tab.selected ? (
        <NoteEditor
          key={tab.selected.id}
          note={tab.selected}
          plots={plots}
          onSaved={tab.handleSaved}
          onDelete={() => tab.remove.mutate(tab.selected!.id)}
          onMeta={(meta) => tab.updateMeta.mutate({ id: tab.selected!.id, meta })}
        />
      ) : (
        <div className="primo-card p-4">
          <EmptyState icon={StickyNote} title="Aucune note dans ce projet" description="Compte rendu de visite, échange avec un vendeur, point syndic… Vos notes sont partagées avec l’équipe et enregistrées automatiquement." action={{ label: "Créer une note", onClick: () => tab.create.mutate() }} framed={false} />
        </div>
      )}
    </div>
  );
}
