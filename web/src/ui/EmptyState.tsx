import { Plus, type LucideIcon } from "lucide-react";

type EmptyStateAction = { label: string; onClick: () => void; icon?: LucideIcon };

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  size?: "sm" | "md";
  framed?: boolean;
};

export default function EmptyState({ icon: Icon, title, description, action, secondaryAction, size = "md", framed = true }: EmptyStateProps) {
  const ActionIcon = action?.icon ?? Plus;
  const isSmall = size === "sm";

  return (
    <div className={`animate-fade-in flex flex-col items-center justify-center text-center ${isSmall ? "gap-2 px-4 py-5" : "gap-3 px-6 py-10"} ${framed ? "rounded-xl border border-dashed border-[#1c1c1e]/10 dark:border-white/10" : ""}`}>
      <span className={`flex items-center justify-center rounded-xl bg-[#1c1c1e]/5 text-[#82828c] dark:bg-white/6 ${isSmall ? "h-9 w-9" : "h-11 w-11"}`}>
        <Icon className={isSmall ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.5} />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{title}</p>
        {description && <p className="text-xs leading-relaxed text-[#82828c]">{description}</p>}
      </div>
      {(action || secondaryAction) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {action && (
            <button onClick={action.onClick} className="flex items-center gap-1.5 rounded-lg border border-[#1c1c1e]/14 px-3 py-1.5 text-xs font-semibold text-[#1c1c1e] transition-colors hover:bg-[#1c1c1e]/4 dark:border-white/16 dark:text-[#fafafa] dark:hover:bg-white/6">
              <ActionIcon className="h-3.5 w-3.5" />
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button onClick={secondaryAction.onClick} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#52525b] transition-colors hover:bg-[#1c1c1e]/5 dark:text-[#d4d4d8] dark:hover:bg-white/7">
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
