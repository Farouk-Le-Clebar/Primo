import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Download, FileText, Share } from "lucide-react";
import toast from "react-hot-toast";
import { getDocumentViewUrl } from "../../../../requests/projects";
import type { ProjectDocument } from "../../../../types/project/documents";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { formatVisitDate } from "../../../../utils/relativeTime";
import { canDisplayPdfInline } from "../../../../utils/displayMode";
import Tag from "../ui/Tag";
import { plotTitle } from "../shared/plotInsights";
import { CATEGORY_LABELS, categoryOf, formatFileSize, isNewDocument } from "./documentMeta";

type DocumentPreviewProps = {
  projectId: string;
  document: ProjectDocument;
  plots: ProjectPlotWithSummary[];
  onOpen: () => void;
  onDownload: () => void;
  onLinkPlot: (plotId: string | null) => void;
};

const ROW = "flex items-center justify-between gap-3 text-xs";

export default function DocumentPreview({ projectId, document, plots, onOpen, onDownload, onLinkPlot }: DocumentPreviewProps) {
  const isPreviewable = document.documentType === "image" || document.documentType === "pdf";
  const { data: viewUrl } = useQuery({
    queryKey: ["documentView", document.id],
    queryFn: () => getDocumentViewUrl(projectId, document.id),
    enabled: isPreviewable,
    staleTime: 5 * 60_000,
  });

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?document=${document.id}`);
    toast.success("Lien du document copié");
  };

  return (
    <motion.aside key={document.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="primo-card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1c1c1e] dark:text-[#fafafa]">Aperçu</h3>
        {isNewDocument(document) && <Tag tone="blue">Nouveau</Tag>}
      </div>
      <button onClick={onOpen} className="group relative h-[247px] overflow-hidden rounded-lg bg-[#1c1c1e]/4 dark:bg-white/5">
        {viewUrl && document.documentType === "image" && <img src={viewUrl} alt={document.documentName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
        {viewUrl && document.documentType === "pdf" && canDisplayPdfInline() && <iframe src={`${viewUrl}#toolbar=0&view=FitH`} title={document.documentName} className="pointer-events-none h-full w-full" />}
        {(!viewUrl || (document.documentType === "pdf" && !canDisplayPdfInline())) && <FileText className="absolute inset-0 m-auto h-10 w-10 text-[#82828c] transition-transform group-hover:scale-110" strokeWidth={1.25} />}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-semibold text-white opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">Ouvrir</span>
      </button>
      <p className="truncate text-sm font-bold text-[#1c1c1e] dark:text-[#fafafa]">{document.documentName}</p>
      <div className="flex flex-col gap-3">
        <div className={ROW}><span className="text-[#82828c]">Déposé par</span><span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{[document.uploaderName, formatVisitDate(document.createdAt)].filter(Boolean).join(" · ")}</span></div>
        <div className={ROW}>
          <span className="text-[#82828c]">Parcelle</span>
          <select value={document.plotId ?? ""} onChange={(event) => onLinkPlot(event.target.value || null)} className="max-w-[220px] truncate bg-transparent text-right font-semibold text-[#1c1c1e] outline-none dark:text-[#fafafa]">
            <option value="">Toutes les parcelles</option>
            {plots.map((plot) => <option key={plot.id} value={plot.id}>{plotTitle(plot)}</option>)}
          </select>
        </div>
        <div className={ROW}><span className="text-[#82828c]">Catégorie</span><span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{CATEGORY_LABELS[categoryOf(document)]}</span></div>
        <div className={ROW}><span className="text-[#82828c]">Taille</span><span className="font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{formatFileSize(document.size)}</span></div>
      </div>
      <div className="flex gap-2">
        <button onClick={onDownload} className="group flex items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-[#1c1c1e]">
          <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          Télécharger
        </button>
        <button onClick={() => void handleShare()} className="group flex items-center gap-1.5 rounded-lg border border-[#1c1c1e]/14 px-3.5 py-2 text-[13px] font-semibold text-[#1c1c1e] transition-colors hover:bg-[#1c1c1e]/4 dark:border-white/16 dark:text-[#fafafa] dark:hover:bg-white/6">
          <Share className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          Partager
        </button>
      </div>
    </motion.aside>
  );
}
