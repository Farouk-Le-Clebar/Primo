import { CalendarDays, Check, Trash2 } from "lucide-react";
import type { ProjectMilestone } from "../../../../types/project/milestones";

type MilestoneRowProps = {
  milestone: ProjectMilestone;
  index: number;
  isLast: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const formatDate = (value: string): string => new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const isOverdue = (milestone: ProjectMilestone): boolean =>
  !milestone.isCompleted && !!milestone.dueDate && new Date(`${milestone.dueDate}T23:59:59`) < new Date();

export default function MilestoneRow({ milestone, index, isLast, onToggle, onDelete }: MilestoneRowProps) {
  const overdue = isOverdue(milestone);
  const completedLabel = milestone.completedAt
    ? `Validé le ${formatDate(milestone.completedAt)}${milestone.completedByName ? ` par ${milestone.completedByName}` : ""}`
    : null;

  return (
    <li style={{ animationDelay: `${index * 40}ms` }} className="animate-rise-in group relative flex gap-3 py-3">
      {!isLast && <span aria-hidden="true" className={`absolute top-10 bottom-0 left-[13px] w-px ${milestone.isCompleted ? "bg-emerald-500/40" : "bg-[#1c1c1e]/10 dark:bg-white/10"}`} />}
      <button
        onClick={onToggle}
        aria-pressed={milestone.isCompleted}
        aria-label={milestone.isCompleted ? `Rouvrir « ${milestone.title} »` : `Valider « ${milestone.title} »`}
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90 ${milestone.isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#1c1c1e]/20 bg-white text-transparent hover:border-emerald-500 hover:text-emerald-500 dark:border-white/20 dark:bg-[#1c1c1e]"}`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </button>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className={`text-sm font-semibold ${milestone.isCompleted ? "text-[#82828c] line-through decoration-[#82828c]/50" : "text-[#1c1c1e] dark:text-[#fafafa]"}`}>{milestone.title}</p>
        {milestone.description && <p className="mt-0.5 text-xs text-[#82828c]">{milestone.description}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
          {milestone.dueDate && (
            <span className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium ${overdue ? "bg-red-500/10 text-red-500" : "bg-[#1c1c1e]/5 text-[#52525b] dark:bg-white/8 dark:text-[#d4d4d8]"}`}>
              <CalendarDays className="h-3 w-3" />
              {overdue ? "En retard · " : "Prévu le "}
              {formatDate(milestone.dueDate)}
            </span>
          )}
          {completedLabel && <span className="font-medium text-emerald-600 dark:text-emerald-400">{completedLabel}</span>}
        </div>
      </div>
      <button
        onClick={onDelete}
        aria-label={`Supprimer « ${milestone.title} »`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#82828c] opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
