import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, FolderPlus, MapPinPlus } from "lucide-react";
import toast from "react-hot-toast";
import type { UsefullPlotData } from "../../../../../types/project/plots";
import type { ProjectResponse } from "../../../../../types/project/projects";
import { addPlotToProject, getProjects } from "../../../../../requests/projects";
import Modal from "../../../../../ui/Modal";
import ModalButton from "../../../../../ui/ModalButton";
import EmptyState from "../../../../../ui/EmptyState";
import CreateProjectModal from "../../../../projects/CreateProjectModal";
import { TONES, initialsOf, toneFor } from "../../../../projects/components/ui/palette";

type AddPlotToProjectModalProps = {
  onClose: () => void;
  plotData: UsefullPlotData;
};

export default function AddPlotToProjectModal({ onClose, plotData }: AddPlotToProjectModalProps) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [creating, setCreating] = useState(false);
  const { data: projects = [], isPending: isLoading } = useQuery<ProjectResponse[]>({ queryKey: ["projects"], queryFn: getProjects });
  const { mutate, isPending } = useMutation({
    mutationFn: () => addPlotToProject({
      projectId: selectedId,
      plotId: plotData.plotId,
      plotBanId: plotData.plotBanId,
      adress: plotData.adress,
      coordinates: plotData.coordinates,
      geometry: JSON.stringify(plotData.geometry),
      parcelProperties: plotData.parcelProperties,
      addressProperties: plotData.addressProperties,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projectPlots", selectedId] });
      queryClient.invalidateQueries({ queryKey: ["project", selectedId] });
      toast.success("Parcelle ajoutée au projet", { id: "add-success" });
      onClose();
    },
    onError: () => toast.error("L’ajout de la parcelle a échoué. Réessayez plus tard.", { id: "add-error" }),
  });

  if (creating) return <CreateProjectModal onClose={() => setCreating(false)} />;

  return (
    <Modal
      title="Ajouter à un projet"
      subtitle={plotData.adress || plotData.plotId}
      icon={MapPinPlus}
      onClose={onClose}
      footer={
        projects.length > 0 && (
          <>
            <ModalButton variant="secondary" icon={FolderPlus} onClick={() => setCreating(true)}>Nouveau projet</ModalButton>
            <span className="flex-1" />
            <ModalButton variant="secondary" onClick={onClose}>Annuler</ModalButton>
            <ModalButton icon={Check} isLoading={isPending} disabled={!selectedId} onClick={() => mutate()}>Ajouter</ModalButton>
          </>
        )
      }
    >
      {isLoading && <div className="h-40 animate-pulse rounded-xl bg-[#1c1c1e]/5 dark:bg-white/6" />}
      {!isLoading && projects.length === 0 && (
        <EmptyState icon={FolderPlus} title="Aucun projet pour l’instant" description="Créez un premier projet pour y ranger cette parcelle et la partager avec votre équipe." action={{ label: "Créer un projet", onClick: () => setCreating(true) }} />
      )}
      <div className="flex max-h-[320px] flex-col gap-1.5">
        {projects.map((project, index) => {
          const tone = TONES[toneFor(project.id)];
          const isSelected = project.id === selectedId;
          return (
            <button
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`animate-rise-in flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${isSelected ? "border-[#1c1c1e] bg-[#1c1c1e]/4 dark:border-white dark:bg-white/6" : "border-[#1c1c1e]/8 hover:border-[#1c1c1e]/20 dark:border-white/10 dark:hover:border-white/25"}`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${tone.soft} ${tone.text}`}>{initialsOf(project.name)}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13px] font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{project.name}</span>
                <span className="text-[11px] text-[#82828c]">{project.numberOfPlots} parcelle{project.numberOfPlots > 1 ? "s" : ""}</span>
              </span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${isSelected ? "scale-110 border-[#1c1c1e] bg-[#1c1c1e] dark:border-white dark:bg-white" : "border-[#1c1c1e]/20 dark:border-white/25"}`}>
                {isSelected && <Check className="h-3 w-3 text-white dark:text-[#1c1c1e]" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
