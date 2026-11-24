type StatColor = "violet" | "emerald" | "amber";

export const colorClasses: Record<StatColor, { text: string; iconBg: string; iconText: string }> = {
  violet: {
    text: "text-violet-500 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-500/10",
    iconText: "text-violet-600 dark:text-violet-400",
  },
  emerald: {
    text: "text-emerald-500 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    text: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
    iconText: "text-amber-600 dark:text-amber-400",
  },
};
