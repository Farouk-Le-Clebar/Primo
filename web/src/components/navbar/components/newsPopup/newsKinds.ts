import { FileText, Flag, Mail, MapPin, Pencil, Sparkles, StickyNote, UserPlus, type LucideIcon } from "lucide-react";
import type { NotificationResponse } from "../../../../requests/notificationRequests";

export type NewsKind = "plot" | "note" | "document" | "member" | "milestone" | "project" | "invitation" | "system";

type NewsKindStyle = {
  label: string;
  icon: LucideIcon;
  dot: string;
  row: string;
  badge: string;
  text: string;
  quote: string;
};

export const NEWS_KINDS: Record<NewsKind, NewsKindStyle> = {
  plot: {
    label: "Parcelles",
    icon: MapPin,
    dot: "bg-violet-500",
    row: "bg-violet-500/5 dark:bg-violet-500/7",
    badge: "bg-violet-500/12 dark:bg-violet-500/20",
    text: "text-violet-500",
    quote: "border-violet-500",
  },
  note: {
    label: "Notes",
    icon: StickyNote,
    dot: "bg-amber-500",
    row: "bg-amber-500/5 dark:bg-amber-500/7",
    badge: "bg-amber-500/12 dark:bg-amber-500/20",
    text: "text-amber-500",
    quote: "border-amber-500",
  },
  document: {
    label: "Documents",
    icon: FileText,
    dot: "bg-blue-500",
    row: "bg-blue-500/5 dark:bg-blue-500/7",
    badge: "bg-blue-500/12 dark:bg-blue-500/20",
    text: "text-blue-500",
    quote: "border-blue-500",
  },
  member: {
    label: "Membres",
    icon: UserPlus,
    dot: "bg-emerald-500",
    row: "bg-emerald-500/5 dark:bg-emerald-500/7",
    badge: "bg-emerald-500/12 dark:bg-emerald-500/20",
    text: "text-emerald-500",
    quote: "border-emerald-500",
  },
  milestone: {
    label: "Jalons",
    icon: Flag,
    dot: "bg-teal-500",
    row: "bg-teal-500/5 dark:bg-teal-500/7",
    badge: "bg-teal-500/12 dark:bg-teal-500/20",
    text: "text-teal-500",
    quote: "border-teal-500",
  },
  project: {
    label: "Projet",
    icon: Pencil,
    dot: "bg-zinc-500",
    row: "",
    badge: "bg-zinc-500/12 dark:bg-zinc-500/20",
    text: "text-zinc-500",
    quote: "border-zinc-500",
  },
  invitation: {
    label: "Invitations",
    icon: Mail,
    dot: "bg-pink-500",
    row: "bg-pink-500/5 dark:bg-pink-500/7",
    badge: "bg-pink-500/12 dark:bg-pink-500/20",
    text: "text-pink-500",
    quote: "border-pink-500",
  },
  system: {
    label: "Primo",
    icon: Sparkles,
    dot: "bg-emerald-500",
    row: "",
    badge: "bg-emerald-500/12 dark:bg-emerald-500/20",
    text: "text-emerald-500",
    quote: "border-emerald-500",
  },
};

export const NEWS_KIND_ORDER: NewsKind[] = ["plot", "note", "document", "member", "milestone", "project", "invitation", "system"];

export function getNewsKind(notification: NotificationResponse): NewsKind {
  if (notification.type === "PROJECT_INVITATION") return "invitation";
  if (notification.type === "SYSTEM") return "system";
  if (notification.type === "DOCUMENT_UPDATE") return "document";
  return notification.metadata?.kind ?? "project";
}
