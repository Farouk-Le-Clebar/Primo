import type { NotificationMetadata } from "../../../../requests/notificationRequests";
import PlotShape from "./PlotShape";

const CARD = "flex w-full items-center gap-2.5 rounded-lg border border-[#1c1c1e]/8 bg-[#1c1c1e]/4 px-2.5 py-2 dark:border-white/8 dark:bg-white/5";
const TITLE = "truncate text-xs font-semibold text-[#1c1c1e] dark:text-[#fafafa]";
const META = "truncate text-[11px] text-[#82828c]";

export function PlotBody({ metadata }: { metadata: NotificationMetadata }) {
  const details = [
    metadata.surfaceM2 ? `${Math.round(metadata.surfaceM2).toLocaleString("fr-FR")} m²` : null,
    metadata.zone ? `Zone ${metadata.zone}` : null,
    metadata.dpe ? `DPE ${metadata.dpe}` : null,
  ].filter(Boolean);

  return (
    <div className={CARD}>
      <PlotShape geometry={metadata.geometry} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={TITLE}>{metadata.address || metadata.plotRef || "Parcelle"}</p>
        {details.length > 0 && <p className={META}>{details.join(" · ")}</p>}
      </div>
    </div>
  );
}

export function NoteBody({ metadata }: { metadata: NotificationMetadata }) {
  const text = metadata.excerpt?.trim() || metadata.title?.trim();
  if (!text) return null;
  return (
    <div className="w-full border-l-2 border-amber-500 px-2.5 py-1.5">
      <p className="line-clamp-3 text-xs font-medium text-[#52525b] dark:text-[#d4d4d8]">« {text} »</p>
    </div>
  );
}

export function MilestoneBody({ metadata }: { metadata: NotificationMetadata }) {
  if (!metadata.title) return null;
  return (
    <div className="w-full border-l-2 border-teal-500 px-2.5 py-1.5">
      <p className="truncate text-xs font-semibold text-[#52525b] dark:text-[#d4d4d8]">✓ {metadata.title}</p>
    </div>
  );
}

const formatSize = (bytes: number): string =>
  bytes >= 1_000_000 ? `${(bytes / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo` : `${Math.max(1, Math.round(bytes / 1000))} Ko`;

const extensionOf = (fileName: string): string => fileName.split(".").pop()?.slice(0, 4).toUpperCase() || "DOC";

export function DocumentBody({ metadata }: { metadata: NotificationMetadata }) {
  const fileName = metadata.fileName ?? "Document";
  return (
    <div className={CARD}>
      <span className="flex h-8 w-7 shrink-0 items-center justify-center rounded-[5px] bg-red-500/12 text-[8px] font-bold text-red-500 dark:bg-red-500/25">
        {extensionOf(fileName)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={TITLE}>{fileName}</p>
        {metadata.size ? <p className={META}>{formatSize(metadata.size)}</p> : null}
      </div>
      <span className="shrink-0 text-xs font-semibold text-blue-500 transition-opacity group-hover:opacity-70">Ouvrir</span>
    </div>
  );
}

const initialsOf = (name: string): string =>
  name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

const ROLE_LABELS: Record<string, string> = { admin: "Administrateur", member: "Éditeur", viewer: "Lecteur" };

export function MemberBody({ metadata }: { metadata: NotificationMetadata }) {
  const name = metadata.actorName ?? "";
  return (
    <div className="flex w-full items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/18 text-[9px] font-bold text-emerald-500 dark:bg-emerald-500/30">
        {initialsOf(name)}
      </span>
      <p className="text-xs font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{name}</p>
      <span className="rounded-full bg-emerald-500/12 px-2.5 py-[5px] text-xs font-semibold text-emerald-500 dark:bg-emerald-500/20">
        {ROLE_LABELS[metadata.role ?? "member"] ?? "Éditeur"}
      </span>
    </div>
  );
}
