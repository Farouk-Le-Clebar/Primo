import { useRef, useState } from "react";
import EmptyState from "../../../../ui/EmptyState";
import { useParams } from "react-router-dom";
import { FileUp, Search, SearchX, Upload } from "lucide-react";
import FilterChips from "../ui/FilterChips";
import { useProjectPlots } from "../dashboard/useProjectData";
import { plotTitle } from "../shared/plotInsights";
import DocumentDropzone, { ACCEPTED_TYPES } from "./DocumentDropzone";
import DocumentPreview from "./DocumentPreview";
import DocumentPreviewEmpty from "./DocumentPreviewEmpty";
import DocumentRow from "./DocumentRow";
import DocumentViewer from "./DocumentViewer";
import { useDocuments } from "./useDocuments";

const HEAD = "shrink-0 text-[11px] font-semibold text-[#82828c]";

export default function DocumentsTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const docs = useDocuments(projectId);
  const { data: plots = [] } = useProjectPlots(projectId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selected = docs.documents.find((document) => document.id === selectedId) ?? docs.visible[0] ?? null;
  const plotLabel = (plotId: string | null) => {
    const plot = plots.find((item) => item.id === plotId);
    return plot ? plotTitle(plot) : null;
  };

  const handleFiles = (files: File[]) => files.forEach((file) => docs.upload.mutate(file));

  if (docs.isPending || !projectId) return <div className="primo-card h-[420px] animate-pulse motion-reduce:animate-none" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChips chips={docs.chips} active={docs.filter} onChange={docs.setFilter} layoutId="document-filters" />
        <span className="flex-1" />
        <label className="flex h-[34px] w-[198px] items-center gap-2 rounded-lg border border-[#1c1c1e]/12 bg-tremor-background px-3 text-[#82828c] dark:border-white/12 dark:bg-dark-tremor-background">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <input value={docs.query} onChange={(event) => docs.setQuery(event.target.value)} placeholder="Nom du fichier…" className="min-w-0 flex-1 bg-transparent text-[13px] text-[#1c1c1e] outline-none placeholder:text-[#82828c] dark:text-white" />
        </label>
        <label className="group flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-[#1c1c1e]">
          <Upload className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          Déposer
          <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} multiple className="hidden" onChange={(event) => handleFiles([...(event.target.files ?? [])])} />
        </label>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="primo-card animate-rise-in overflow-x-auto p-2">
          <div className={docs.visible.length > 0 ? "min-w-[760px]" : ""}>
            <div className={`gap-3 px-2.5 py-3 ${docs.visible.length > 0 ? "flex" : "hidden md:flex"}`}>
              <span className={`flex-1 ${HEAD}`}>Fichier</span>
              <span className={`w-[100px] ${HEAD}`}>Catégorie</span>
              <span className={`w-[150px] ${HEAD}`}>Parcelle liée</span>
              <span className={`w-[68px] ${HEAD}`}>Taille</span>
              <span className={`w-[120px] ${HEAD}`}>Déposé par</span>
              <span className="w-7" />
            </div>
            {docs.visible.length === 0 && (docs.documents.length === 0 ? (
              <div className="p-2"><EmptyState icon={FileUp} title="Aucun document partagé" description="Mandats, diagnostics, plans ou photos : déposez-les ici pour que toute l’équipe y ait accès." action={{ label: "Déposer un fichier", onClick: () => fileInputRef.current?.click(), icon: Upload }} /></div>
            ) : (
              <EmptyState icon={SearchX} title="Aucun document pour ce filtre" size="sm" framed={false} secondaryAction={{ label: "Voir tous les documents", onClick: () => { docs.setFilter("all"); docs.setQuery(""); } }} />
            ))}
            <div className="flex flex-col gap-0.5">
              {docs.visible.map((document, index) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  index={index}
                  plotLabel={plotLabel(document.plotId)}
                  selected={selected?.id === document.id}
                  onSelect={() => setSelectedId(document.id)}
                  onCategory={(category) => docs.updateMeta.mutate({ id: document.id, meta: { category } })}
                  onDelete={() => docs.remove.mutate(document.id)}
                />
              ))}
            </div>
            <DocumentDropzone progress={docs.progress} onFiles={handleFiles} />
          </div>
        </div>
        {!selected && <DocumentPreviewEmpty projectId={projectId} hasDocuments={docs.documents.length > 0} />}
        {selected && (
          <DocumentPreview
            projectId={projectId}
            document={selected}
            plots={plots}
            onOpen={() => setViewing(true)}
            onDownload={() => void docs.download(selected)}
            onLinkPlot={(plotId) => docs.updateMeta.mutate({ id: selected.id, meta: { plotId } })}
          />
        )}
      </div>
      {viewing && selected && <DocumentViewer projectId={projectId} document={selected} onClose={() => setViewing(false)} onDownload={() => void docs.download(selected)} />}
    </div>
  );
}
