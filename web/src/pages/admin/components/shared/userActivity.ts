export type ActivityStatus = {
  label: string;
  dot: string;
  text: string;
};

const DAY = 86_400_000;

const STATUSES: Record<"recent" | "month" | "idle" | "never", ActivityStatus> = {
  recent: { label: "Actif aujourd'hui", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  month: { label: "Actif ce mois", dot: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
  idle: { label: "Inactif", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  never: { label: "Jamais connecté", dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400" },
};

const relativeFormatter = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

const toTime = (value: string | Date | null | undefined): number | null => {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isFinite(time) ? time : null;
};

export const getActivityStatus = (lastConnection: string | Date | null): ActivityStatus => {
  const time = toTime(lastConnection);
  if (time === null) return STATUSES.never;
  const elapsed = Date.now() - time;
  if (elapsed < DAY) return STATUSES.recent;
  if (elapsed < 30 * DAY) return STATUSES.month;
  return STATUSES.idle;
};

export const formatRelative = (value: string | Date | null | undefined): string => {
  const time = toTime(value);
  if (time === null) return "jamais";
  const minutes = Math.round((time - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relativeFormatter.format(days, "day");
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return relativeFormatter.format(months, "month");
  return relativeFormatter.format(Math.round(months / 12), "year");
};
