import { useParams } from "react-router-dom";
import { Flag, ListPlus } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import SectionCard from "../ui/SectionCard";
import MilestoneForm from "./MilestoneForm";
import MilestoneRow from "./MilestoneRow";
import { useMilestones } from "./useMilestones";

export default function MilestonesTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const tab = useMilestones(projectId);
  const subtitle = tab.milestones.length
    ? `${tab.completed} sur ${tab.milestones.length} validé${tab.completed > 1 ? "s" : ""}${tab.nextMilestone ? ` · prochaine étape : ${tab.nextMilestone.title}` : " · projet terminé"}`
    : "Aucune étape définie";

  if (tab.isPending) return <div className="primo-card h-[360px] animate-pulse motion-reduce:animate-none" />;

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <SectionCard title="Jalons du projet" subtitle={subtitle} action={<span className="text-2xl font-bold tabular-nums text-[#1c1c1e] dark:text-[#fafafa]">{tab.progress} %</span>}>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1c1c1e]/6 dark:bg-white/8" role="progressbar" aria-valuenow={tab.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Avancement du projet">
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 ease-out" style={{ width: `${tab.progress}%` }} />
        </div>
        {tab.milestones.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Flag}
              title="Aucun jalon pour l’instant"
              description="Découpez le projet en étapes clés (visite, offre, compromis…) et validez-les au fil de l’avancement."
              action={{ label: "Ajouter les étapes types", onClick: () => tab.addTemplates.mutate(), icon: ListPlus }}
            />
          </div>
        ) : (
          <ol className="mt-2">
            {tab.milestones.map((milestone, index) => (
              <MilestoneRow
                key={milestone.id}
                milestone={milestone}
                index={index}
                isLast={index === tab.milestones.length - 1}
                onToggle={() => tab.toggle.mutate(milestone)}
                onDelete={() => tab.remove.mutate(milestone.id)}
              />
            ))}
          </ol>
        )}
      </SectionCard>
      <MilestoneForm isSaving={tab.create.isPending} onSubmit={(payload, reset) => tab.create.mutate(payload, { onSuccess: reset })} />
    </div>
  );
}
