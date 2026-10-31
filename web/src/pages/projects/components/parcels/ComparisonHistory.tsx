import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, Clock, Loader2, Trash2, Trophy, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { deletePlotComparison, getPlotComparisons } from "../../../../requests/projects";
import type { PlotComparison } from "../../../../types/project/comparisons";
import { formatDate } from "./plotFormat";

type ComparisonHistoryProps = {
    projectId: string;
    onOpen: (comparisonId: string) => void;
    onClose: () => void;
};

const StatusIcon = ({ comparison }: { comparison: PlotComparison }) => {
    if (comparison.status === "completed") return <Trophy className="h-4 w-4 text-emerald-600" />;
    if (comparison.status === "failed") return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
};

const statusText = (comparison: PlotComparison) => {
    if (comparison.status === "completed" && comparison.result)
        return `Recommandée : ${comparison.result.winner === "A" ? comparison.plotALabel : comparison.plotBLabel}`;
    return comparison.status === "failed" ? "Analyse échouée" : "Analyse en attente";
};

const ComparisonHistory = ({ projectId, onOpen, onClose }: ComparisonHistoryProps) => {
    const queryClient = useQueryClient();
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const { data: comparisons, isPending } = useQuery({
        queryKey: ["project", projectId, "comparisons"],
        queryFn: () => getPlotComparisons(projectId),
    });

    const { mutate: removeComparison } = useMutation({
        mutationFn: (comparisonId: string) => deletePlotComparison(projectId, comparisonId),
        onSuccess: () => {
            setIdToDelete(null);
            queryClient.invalidateQueries({ queryKey: ["project", projectId, "comparisons"] });
            toast.success("Comparaison supprimée.");
        },
        onError: (err: { message?: string }) => {
            setIdToDelete(null);
            toast.error(err?.message ?? "Impossible de supprimer la comparaison.");
        },
    });

    return (
        <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/80" onClick={onClose}>
            <div
                className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-xl dark:border-white/10 dark:bg-[#171717] dark:text-gray-200"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/5">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Historique des comparaisons</h2>
                    <button onClick={onClose} className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-white" title="Fermer">
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto scrollbar-custom">
                    {isPending ? (
                        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
                    ) : !comparisons || comparisons.length === 0 ? (
                        <p className="py-10 text-center text-sm italic text-gray-500 dark:text-gray-400">Aucune comparaison pour le moment.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-white/5">
                            {comparisons.map((comparison) => (
                                <li key={comparison.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                                    <button className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left" onClick={() => onOpen(comparison.id)}>
                                        <span className="mt-0.5"><StatusIcon comparison={comparison} /></span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-200">
                                                {comparison.plotALabel} <span className="text-gray-400">vs</span> {comparison.plotBLabel}
                                            </span>
                                            <span className="block truncate text-xs text-gray-500 dark:text-[#999999]">
                                                {statusText(comparison)} · {formatDate(comparison.createdAt)}
                                            </span>
                                        </span>
                                    </button>
                                    {idToDelete === comparison.id ? (
                                        <div className="flex items-center gap-2">
                                            <button className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-gray-400 transition-colors hover:bg-gray-300 hover:text-white dark:hover:bg-gray-600"
                                                onClick={() => setIdToDelete(null)} title="Annuler">
                                                <X className="h-4 w-4" />
                                            </button>
                                            <button className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                                                onClick={() => removeComparison(comparison.id)} title="Confirmer la suppression">
                                                <Check className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="cursor-pointer p-2 text-red-700 transition-transform hover:scale-110" onClick={() => setIdToDelete(comparison.id)} title="Supprimer">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonHistory;
