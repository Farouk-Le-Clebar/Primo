import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";
import Button from "../../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../requests/projects";
import LoadingPrimoLogo from "../../components/animations/LoadingPrimoLogo";
import toast from "react-hot-toast";

type CreateProjectModalProps = {
    onClose: () => void;
};

const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();

    const { mutate: createProjectMutation, isPending } = useMutation({
        mutationFn: () => createProject(name, description),
        onSuccess: () => {
            onClose();
            toast.success("Projet créé avec succès !");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: () => {
            toast.error("Erreur est survenue lors de la création du projet.");
        }
    });

    return createPortal(
        <div className="absolute top-0 left-0 w-screen h-screen bg-black/60 dark:bg-black/80 dark:border-white/5 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
            <div className="bg-white dark:bg-[#171717] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Créer un projet
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-2 text-gray-400 dark:text-gray-500 rounded-full outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-2.5">
                        <label htmlFor="projectName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nom du projet <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ex: Lotissement Les Oliviers"
                            className="w-full p-3 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 focus:border-black/10 dark:focus:border-white/10"
                        />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label htmlFor="projectDesc" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description <span className="text-gray-400 dark:text-gray-500 font-normal">(optionnel)</span>
                        </label>
                        <textarea
                            id="projectDesc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ajoutez quelques détails sur ce projet..."
                            rows={4}
                            className="w-full p-3 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none outline-none focus:outline-none focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 focus:border-black/10 dark:focus:border-white/10"
                        />
                    </div>
                    {isPending ? (
                        <div className="flex items-center justify-center">
                            <LoadingPrimoLogo className="h-7 w-7 dark:invert" />
                        </div>
                    ) : (
                        <div className="mt-4">
                            <Button
                                backgroundColor="bg-black dark:bg-white"
                                backgroundHoverColor="hover:bg-black/85 hover:dark:bg-white/80"
                                className="w-full text-white dark:text-black"
                                textHoverColor="hover:text-white dark:hover:text-black"
                                textSize="text-base"
                                onClick={() => {
                                    createProjectMutation();
                                }}
                                disabled={!name.trim()}
                            >
                                Créer le projet
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CreateProjectModal;