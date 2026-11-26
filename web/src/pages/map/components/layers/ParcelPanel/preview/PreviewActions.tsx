import { ArrowRight, Plus } from "lucide-react";

import { Tooltip } from "../../../../../../ui/Tooltip";

type PreviewActionsProps = {
  onAddToProject: () => void;
  onOpenDashboard: () => void;
};

export default function PreviewActions({ onAddToProject, onOpenDashboard }: PreviewActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        onClick={onAddToProject}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#111111] px-4 text-xs font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-[#e8e8e8]"
      >
        <Plus size={14} />
        <span>Projet</span>
      </button>
      <Tooltip content="Analyse complète">
        <button
          onClick={onOpenDashboard}
          aria-label="Analyse complète"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/[0.06] text-gray-900 transition-colors hover:bg-black/10 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/15"
        >
          <ArrowRight size={15} />
        </button>
      </Tooltip>
    </div>
  );
}
