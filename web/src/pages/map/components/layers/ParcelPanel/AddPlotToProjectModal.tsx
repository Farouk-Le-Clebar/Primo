import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogPanel, Select, SelectItem, Button } from "@tremor/react";
import { useState } from "react";
import type { UsefullPlotData } from "../../../../../types/project/plots";
import { toast } from "react-hot-toast";
import { addPlotToProject, getProjects } from "../../../../../requests/projects";
import type { ProjectResponse } from "../../../../../types/project/projects";

type AddPlotToProjectModalProps = {
    isOpen?: boolean;
    onClose: () => void;
    plotData: UsefullPlotData;
};

const AddPlotToProjectModal = ({ isOpen = true, onClose, plotData }: AddPlotToProjectModalProps) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    const { data: projects } = useQuery<ProjectResponse[]>({
        queryKey: ['projects'],
        queryFn: getProjects,
        refetchOnWindowFocus: false,
    });

    const { mutate: addPlotToProjectMutation, isPending } = useMutation({
        mutationFn: () => addPlotToProject({
            projectId: selectedProjectId,
            plotId: plotData.plotId,
            plotBanId: plotData.plotBanId,
            adress: plotData.adress,
            coordinates: plotData.coordinates,
            geometry: JSON.stringify(plotData.geometry)
        }),
        onSuccess: () => {
            toast.success("Parcelle ajoutée au projet avec succès !", {
                id: "add-success",
            });
            onClose();
        },
        onError: () => {
            toast.error("Une erreur est survenue lors de l'ajout de la parcelle au projet. Réessayez plus tard.", {
                id: "add-error",
            });
            onClose();
        }
    });

    return (
        <Dialog open={isOpen} onClose={onClose} static={true} className="z-[9999]">
            <DialogPanel className="sm:max-w-md bg-white dark:bg-[#171717] border border-gray-100 dark:border-white/10 transition-colors ring-0 dark:ring-0">
                
                <div className="absolute right-0 top-0 pr-3 pt-3">
                    <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" aria-hidden={true} />
                    </button>
                </div>
                
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 pr-6">
                    Ajouter la parcelle
                </h4>

                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sélectionnez un projet de destination
                        </label>

                        <Select
                            value={selectedProjectId}
                            onValueChange={setSelectedProjectId}
                            placeholder="-- Choisir un projet --"
                            className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                        >
                            {projects?.length === 0 ? (
                                <SelectItem value="" disabled>Aucun projet trouvé</SelectItem>
                            ) : (
                                projects?.map(project => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.name}
                                    </SelectItem>
                                ))
                            )}
                        </Select>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-xs text-center leading-relaxed">
                        La parcelle sera liée à ce projet. Vous pourrez y accéder et la gérer à tout moment depuis votre tableau de bord ou depuis la page projets.
                    </p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="dark:border-white/10 dark:!text-white dark:hover:bg-white/5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            onClick={() => addPlotToProjectMutation()}
                            disabled={!selectedProjectId || isPending}
                            loading={isPending}
                            className="dark:bg-white dark:text-black dark:hover:bg-gray-200 border-transparent hover:border-transparent bg-black hover:bg-gray-800 transition-colors"
                        >
                            Confirmer l'ajout
                        </Button>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    );
}

export default AddPlotToProjectModal;