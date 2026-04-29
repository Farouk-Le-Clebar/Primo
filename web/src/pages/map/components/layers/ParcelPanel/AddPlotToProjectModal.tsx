import { useMutation, useQuery } from "@tanstack/react-query";
import { addPlotToProject, fetchProjects } from "../../../../../requests/projectRequests";
import { X, ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";
import Button from "../../../../../ui/Button";
import { useState } from "react";
import type { UsefullPlotData } from "../../../../../types/project/plots";
import { toast } from "react-hot-toast";

type AddPlotToProjectModalProps = {
    onClose: () => void;
    plotData: UsefullPlotData;
};

const AddPlotToProjectModal = ({ onClose, plotData }: AddPlotToProjectModalProps) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data: projects } = useQuery({
        queryKey: ['projects'],
        queryFn: () => fetchProjects()
    });

    const { mutate: addPlotToProjectMutation } = useMutation({
        mutationFn: () => addPlotToProject({ projectId: selectedProjectId || "", plotId: plotData.plotId, plotBanId: plotData.plotBanId, adress: plotData.adress }),
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

    const selectedProject = projects?.find(p => p.id === selectedProjectId);

    return createPortal(
        <div className="absolute top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Ajouter la parcelle
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Sélectionnez un projet de destination
                        </label>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full bg-gray-50 border transition-all flex items-center justify-between rounded-lg p-3 text-sm outline-none cursor-pointer
                                    border-gray-200 hover:border-gray-300`}
                            >
                                <span className={selectedProject ? "text-gray-800 font-medium" : "text-gray-400"}>
                                    {selectedProject ? selectedProject.name : "-- Choisir un projet --"}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 py-1">
                                    {projects?.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">Aucun projet trouvé</div>
                                    ) : (
                                        projects?.map(project => (
                                            <div
                                                key={project.id}
                                                onClick={() => {
                                                    setSelectedProjectId(project.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between mx-1 rounded-lg
                                                    ${selectedProjectId === project.id
                                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                                            >
                                                {project.name}
                                                {selectedProjectId === project.id && <Check size={16} className="text-gray-800" />}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        backgroundColor="bg-black"
                        backgroundHoverColor="hover:bg-gray-800"
                        className="w-full"
                        textSize="text-base"
                        onClick={() => addPlotToProjectMutation()}
                        disabled={!selectedProjectId}
                    >
                        Confirmer l'ajout au projet
                    </Button>

                    <p className="text-gray-500 text-xs text-center leading-relaxed mt-2">
                        La parcelle sera liée à ce projet. Vous pourrez y accéder et la gérer à tout moment depuis votre tableau de bord ou depuis la page projets.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AddPlotToProjectModal;