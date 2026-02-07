import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { createProject } from "../../requests/projectRequests";
import Input from "../../ui/Input";

import { MAX_NAME_LENGTH } from "../../constants/project.constants";

export default function AddProjectPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        notes: "",
    });

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError("Le nom du projet est requis");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const newProject = await createProject({
                name: formData.name.trim(),
                notes: formData.notes.trim() || undefined,
            });

            navigate(`/projects/${newProject.id}`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Erreur lors de la création du projet",
            );
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/projects");
    };

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden font-UberMove">
            {/* Header*/}
            <div className="flex-shrink-0 px-7 pt-1 pb-0 bg-white border-b border-gray-200">
                <div className="relative flex items-center justify-between h-12">
                    {/* return*/}
                    <div className="flex items-center gap-4 z-10">
                        <button
                            onClick={handleCancel}
                            className="flex cursor-pointer items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-900" />
                            <span className="text-xs font-medium">Retour</span>
                        </button>
                    </div>

                    {/* Title*/}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max">
                        <h1 className="text-sm font-semibold text-gray-900">
                            Nouveau Projet
                        </h1>
                    </div>

                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-10 py-8">
                <div className="w-full ">
                    {/* Section  Title + create button */}
                    <div className="flex w-full items-end justify-between pb-1">
                        <h2 className="font-UberMove mb-1 text-2xl font-medium text-gray-900 leading-none">
                            Informations du projet
                        </h2>
                        <button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className={`mb-1 text-sm text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm
                                ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#388160] hover:bg-[#2d664c] active:scale-95"}
                            `}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Création...
                                </div>
                            ) : (
                                "Créer le projet"
                            )}
                        </button>
                    </div>

                    <hr className="border-t border-gray-200" />

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <div className="flex flex-col space-y-7 mt-10">
                        {/* Project name */}
                        <div className="flex flex-col space-y-1.5 w-1/2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">
                                Nom du projet{" "}
                                <span className="text-red-400">*</span>
                            </label>
                            <Input
                                type="text"
                                height="h-10"
                                placeholder="Ex: Ferme des Trois Chênes"
                                onChange={(val: string) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: val.slice(0, MAX_NAME_LENGTH),
                                    }))
                                }
                                value={formData.name}
                                className="bg-[#EFEFF4] border-none focus:ring-2 focus:ring-[#388160]"
                            />
                            <p className="text-xs text-gray-400 ml-1">
                                {formData.name.length}/{MAX_NAME_LENGTH}{" "}
                                caractères
                            </p>
                        </div>

                        {/* Notes */}
                        <div className="flex flex-col space-y-1.5 w-3/4">
                            <label className="text-sm font-semibold text-gray-700 ml-1">
                                Notes{" "}
                                <span className="text-gray-400 font-normal">
                                    (optionnel)
                                </span>
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        notes: e.target.value,
                                    }))
                                }
                                placeholder="Ajouter des notes sur ce projet..."
                                rows={7}
                                disabled={isSubmitting}
                                className="w-full px-4 py-2.5 text-sm bg-[#EFEFF4] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388160] resize-none placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Info complémentaire */}
                    <div className="mt-10 p-4 bg-blue-50 border border-blue-200 rounded-lg w-1/2">
                        <p className="text-sm text-blue-800">
                            <strong>À savoir :</strong> Vous pourrez ajouter des
                            parcelles et paramètres après la création du projet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
