import { useQuery } from "@tanstack/react-query";
import { FileImage, FileText, FileType, HardDrive } from "lucide-react";
import { getStorageUsage } from "../../../../requests/projects";
import type { StorageUsage } from "../../../../types/project/documents";
import { formatFileSize } from "./documentMeta";

type DocumentPreviewEmptyProps = { projectId: string; hasDocuments: boolean };

const FORMATS = [
  { icon: FileText, label: "PDF", detail: "Mandats, diagnostics, PV" },
  { icon: FileType, label: "Word", detail: "Comptes rendus, courriers" },
  { icon: FileImage, label: "Images", detail: "Photos, plans scannés" },
];

export default function DocumentPreviewEmpty({ projectId, hasDocuments }: DocumentPreviewEmptyProps) {
  const { data: storage } = useQuery<StorageUsage>({ queryKey: ["project", projectId, "storage"], queryFn: () => getStorageUsage(projectId) });
  const percent = storage ? Math.min(100, Math.round((storage.used / storage.quota) * 100)) : 0;

  return (
    <aside className="primo-card animate-fade-in flex flex-col gap-4 p-5">
      <h3 className="text-[15px] font-bold text-[#1c1c1e] dark:text-[#fafafa]">Aperçu</h3>
      <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#1c1c1e]/10 bg-[#1c1c1e]/[0.02] text-center dark:border-white/10 dark:bg-white/[0.02]">
        <FileText className="h-7 w-7 text-[#82828c]" strokeWidth={1.25} />
        <p className="max-w-[240px] text-xs text-[#82828c]">
          {hasDocuments ? "Sélectionnez un document dans la liste pour l’afficher ici." : "Le premier document déposé s’affichera ici avec ses informations."}
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-xs font-semibold text-[#52525b] dark:text-[#d4d4d8]">Formats acceptés · 20 Mo max</p>
        {FORMATS.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex items-center gap-2.5 text-xs">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1c1c1e]/5 text-[#52525b] dark:bg-white/6 dark:text-[#d4d4d8]">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{label}</span>
            <span className="text-[#82828c]">{detail}</span>
          </div>
        ))}
      </div>
      {storage && (
        <div className="flex flex-col gap-1.5 border-t border-[#1c1c1e]/8 pt-4 dark:border-white/8">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#52525b] dark:text-[#d4d4d8]"><HardDrive className="h-3.5 w-3.5" /> Stockage du projet</span>
            <span className="text-[#82828c]">{formatFileSize(storage.used)} / {formatFileSize(storage.quota)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#1c1c1e]/6 dark:bg-white/8">
            <div className={`h-full rounded-full transition-[width] duration-500 ${percent > 85 ? "bg-red-500" : "bg-[#1c1c1e] dark:bg-white"}`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
    </aside>
  );
}
