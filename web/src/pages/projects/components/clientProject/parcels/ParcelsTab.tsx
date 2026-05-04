import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deletePlotFromProject, getProjectPlots } from "../../../../../requests/projectRequests";
import PlotMap from "./PlotMap";
import type { ProjectPlotResponse } from "../../../../../types/project/plots";
import LoadingPrimoLogo from "../../../../../components/animations/LoadingPrimoLogo";
import { useNavigate } from "react-router-dom";
import { Check, Cross, ExternalLink, ExternalLinkIcon, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../../../ui/Button";
import { useState } from "react";

type ParcelsTabProps = {
    projectId: string;
};

const ParcelsTab = ({ projectId }: ParcelsTabProps) => {
    const queryClient = useQueryClient();
    const [validationDeleteOpen, setValidationDeleteOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const { data: parcels, isLoading, isPending } = useQuery<ProjectPlotResponse[]>({
        queryKey: ["projectPlots", projectId],
        queryFn: () => getProjectPlots(projectId),
        refetchOnWindowFocus: false,
    });

    const { mutate: removePlotFromProject, isPending: isRemovingPlot } = useMutation({
        mutationFn: (plotId: string) => deletePlotFromProject(projectId, plotId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projectPlots", projectId] });
            toast.success("Parcelle supprimée du projet.");
            setIdToDelete(null);
            setValidationDeleteOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.response.data.message);
        }
    });

    const navigate = useNavigate();

    const handlePlotClick = (id: string) => {

    };

    const handleRemovePlot = (id: string) => {
        removePlotFromProject(id);

    };

    const handleMapClick = (coordinates: string) => {
        const [x, y] = coordinates.split(",");
        navigate(`/search?coo_x=${x}&coo_y=${y}`);
    };

    return (
        <div className="flex-1 w-full p-4 h-full overflow-y-auto">
            {isLoading || isPending || isRemovingPlot ? (
                <div className="absolute inset-0 z-1000 flex items-center justify-center">
                    <LoadingPrimoLogo
                        className="h-10 w-10"
                    />
                </div>
            ) : null}
            {parcels && parcels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {parcels?.map((plot) => (
                        <div
                            key={plot.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                            onClick={() => handlePlotClick(plot.id)}
                        >
                            <button
                                className="cursor-pointer h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden"
                                onClick={() => handleMapClick(plot.coordinates)}
                            >
                                <PlotMap plot={plot} />
                            </button>

                            <div className="p-4 flex flex-row justify-between">
                                <div className="flex flex-col gap-1.5 text-left">
                                    <button
                                        className="font-semibold flex flex-row gap-1 items-center text-gray-800 text-sm line-clamp-2 cursor-pointer hover:underline"
                                        title={plot.adress}
                                    >
                                        {plot.adress} <ExternalLink className="w-3 h-3" />
                                    </button>

                                    {plot.plotId && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            <span className="font-medium mr-1 text-gray-600">ID:</span>
                                            {plot.plotId}
                                        </div>
                                    )}
                                    {plot.plotBanId && (
                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium mr-1 text-gray-600">BAN:</span>
                                            {plot.plotBanId}
                                        </div>
                                    )}
                                </div>
                                {validationDeleteOpen && idToDelete === plot.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="rounded-full p-0.5 hover:bg-gray-300 hover:text-white hover:border-none cursor-pointer border border-gray-400 text-gray-400"
                                            onClick={() => { setIdToDelete(null); setValidationDeleteOpen(false); }}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="rounded-full bg-red-600 p-0.5 hover:bg-red-700 cursor-pointer text-white"
                                            onClick={() => {
                                                handleRemovePlot(plot.id);
                                            }}
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="cursor-pointer text-gray-500 hover:text-gray-600"
                                        onClick={() => { setIdToDelete(plot.id); setValidationDeleteOpen(true); }}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : !isLoading && !isPending && !isRemovingPlot ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-gray-500">
                    <p>Aucune parcelle liée à ce projet.</p>
                    <Button
                        className="mt-4"
                        width="w-65"
                        height="h-10"
                        backgroundColor="bg-black"
                        backgroundHoverColor="hover:bg-gray-700"
                        textSize="text-base"
                        onClick={() => navigate("/search")}
                    >
                        <div className="flex flex-row items-center justify-center gap-1">
                            <p>Ajouter une parcelle</p>
                            <ExternalLinkIcon className="w-4 h-4" />
                        </div>
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

export default ParcelsTab;
