import React from "react";
import MapView from "./MapView";
import ParametersCard from "./ParametersCard";
import ComparatorCard from "./ComparatorCard";
import NotesCard from "./NotesCard";

type OverviewTabProps = {
    project: any;
    isLoading: boolean;
    notes: string;
    onNotesChange: (notes: string) => void;
    onViewAllParameters: () => void;
    canEdit?: boolean;
};

const OverviewTab: React.FC<OverviewTabProps> = ({
    project,
    isLoading,
    notes,
    onNotesChange,
    onViewAllParameters,
    canEdit = true,
}) => {
    return (
        <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* MapView */}
            <div className="flex-shrink-0 h-96">
                <MapView parcels={project?.parcels} isLoading={isLoading} />
            </div>

            <div className="flex-1 grid grid-cols-2 lg:grid-cols-2 gap-4 min-h-0 pb-7">
                <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 min-h-0">
                        <ParametersCard
                            data={project?.parameters}
                            isLoading={isLoading}
                            onViewAll={onViewAllParameters}
                        />
                    </div>
                    <div className="flex-1 min-h-0">
                        <ComparatorCard isLoading={isLoading} />
                    </div>
                </div>
                <div className="lg:col-span-1 min-h-0">
                    <NotesCard
                        notes={notes}
                        isLoading={isLoading}
                        onNotesChange={onNotesChange}
                        canEdit={canEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
