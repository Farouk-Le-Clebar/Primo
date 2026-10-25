import { DoorOpen } from "lucide-react";

import type { LogementTarget } from "./types";
import { targetSummary } from "./units";

type TargetBannerProps = {
  target: LogementTarget;
  matches: number;
  onShow?: () => void;
};

export default function TargetBanner({ target, matches, onShow }: TargetBannerProps) {
  return (
    <div className="primo-page-enter flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/5">
      <DoorOpen size={16} className="shrink-0 text-emerald-700 dark:text-emerald-400" />
      <span className="min-w-0 flex-1 text-emerald-900 dark:text-emerald-200">
        Logement ciblé : <span className="font-semibold">{targetSummary(target)}</span> · {matches} correspondance{matches > 1 ? "s" : ""} signalée{matches > 1 ? "s" : ""} ci-dessous
      </span>
      {onShow && (
        <button onClick={onShow} className="shrink-0 font-medium text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-300">
          Voir la fiche logement
        </button>
      )}
    </div>
  );
}
