export const chip = (active: boolean): string =>
  `rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 ${
    active
      ? "bg-gray-900 text-white dark:bg-white dark:text-black"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
  }`;

export const TONES = {
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
} as const;

export type Tone = keyof typeof TONES;

export const KPI_TONES: Record<Tone, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  gray: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
};
