import { useQuery } from "@tanstack/react-query";
import { getProjectPlots } from "../../../../../requests/projectRequests";
import AnimatedPrimoLogo from "../../../../../components/animations/AnimatedPrimoLogo";
import { useState } from "react";

type ParcelsTabProps = {
    projectId: string;
};

const ParcelsTab = ({ projectId }: ParcelsTabProps) => {
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);

    const { data: parcels, isLoading } = useQuery({
        queryKey: ["projectPlots", projectId],
        queryFn: () => getProjectPlots(projectId),
    });

    // On affiche le logo tant que ça charge OU que l'animation n'est pas finie
    if (isLoading || !isAnimationFinished) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <AnimatedPrimoLogo
                    className="h-[40px] w-[40px]"
                    onComplete={() => setIsAnimationFinished(true)}
                />
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-400 text-sm font-medium">Parcelles</p>
                <p className="text-gray-300 text-xs mt-1">Contenu à venir</p>
            </div>
        </div>
    );
};

export default ParcelsTab;
