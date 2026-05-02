import { useQuery } from "@tanstack/react-query";
import { getProjectPlots } from "../../../../../requests/projectRequests";
import AnimatedPrimoLogo from "../../../../../components/animations/AnimatedPrimoLogo";
import { useState } from "react";
import PlotMap from "./PlotMap";
import type { ProjectPlotResponse } from "../../../../../types/project/plots";
import LoadingPrimoLogo from "../../../../../components/animations/LoadingPrimoLogo";

type ParcelsTabProps = {
    projectId: string;
};

const ParcelsTab = ({ projectId }: ParcelsTabProps) => {

    const { data: parcels, isLoading } = useQuery<ProjectPlotResponse[]>({
        queryKey: ["projectPlots", projectId],
        queryFn: () => getProjectPlots(projectId),
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <LoadingPrimoLogo
                    className="h-[40px] w-[40px]"
                />
            </div>
        );
    }

    const handlePlotClick = (id: string) => {

    };

    return (
        <div className="flex-1 w-full p-4 h-full overflow-y-auto">
            {parcels && parcels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {parcels?.map((plot) => (
                        <button
                            key={plot.id}
                            className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                            onClick={() => handlePlotClick(plot.id)}
                        >
                            <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                <PlotMap plot={plot} />
                            </div>

                            <div className="p-4 flex flex-col gap-1.5 text-left">
                                <h3
                                    className="font-semibold text-gray-800 text-sm line-clamp-2"
                                    title={plot.adress}
                                >
                                    {plot.adress}
                                </h3>

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
                        </button>
                    ))}
                </div>
            ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                    Aucune parcelle liée à ce projet.
                </div>
            )}
        </div>
    );
};

export default ParcelsTab;
