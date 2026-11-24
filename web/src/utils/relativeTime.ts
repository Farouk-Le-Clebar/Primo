const DAY_MS = 86_400_000;

const timeFormatter = new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "2-digit" });
const weekdayFormatter = new Intl.DateTimeFormat("fr-FR", { weekday: "long" });
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const fullFormatter = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "short" });

const formatClock = (date: Date): string => timeFormatter.format(date).replace(":", " h ");

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export function formatRelativeTime(value: string | Date, now: Date = new Date()): string {
  const date = new Date(value);
  const elapsedMs = now.getTime() - date.getTime();
  const minutes = Math.floor(elapsedMs / 60_000);
  if (minutes < 1) return "À l’instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (minutes < 12 * 60) return `Il y a ${Math.floor(minutes / 60)} h`;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (date.getTime() >= startOfToday) return `Aujourd’hui à ${formatClock(date)}`;
  if (date.getTime() >= startOfToday - DAY_MS) return `Hier à ${formatClock(date)}`;
  if (date.getTime() >= startOfToday - 6 * DAY_MS) return capitalize(weekdayFormatter.format(date));
  return dateFormatter.format(date);
}

export function formatVisitDate(value: string | Date): string {
  const date = new Date(value);
  return `${fullFormatter.format(date)} à ${formatClock(date)}`;
}
