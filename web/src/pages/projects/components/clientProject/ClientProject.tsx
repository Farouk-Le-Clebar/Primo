import React, { useState } from "react";
import {
    useProjectDetail,
    useNotes,
    useFavorite,
} from "../../../../hooks/useProjectDetail";
import { useCurrentMemberRole } from "../../../../hooks/useCurrentMemberRole";

import ProjectHeader from "./ProjectHeader";
import { OverviewTab } from "./overview";
import { ParametersTab } from "./parameters";
import { ParcelsTab } from "./parcels";
import { DocumentsTab } from "./documents";
import { ActivitiesTab } from "./activities";
import { MembersTab } from "./members";
import type { TabKey } from "../../../../types/project/projectTab";

type ProjectDetailPageProps = {
    projectId?: string;
    onBack?: () => void;
};

export const ClientProjectPage: React.FC<ProjectDetailPageProps> = ({
    projectId,
    onBack,
}) => {
    const [activeTab, setActiveTab] = useState<TabKey>("overview");

    const { project, isLoading, error } = useProjectDetail(projectId);

    const { isFavorite, toggleFavorite } = useFavorite(
        project?.isFavorite || false,
        projectId,
    );

    const { notes, setNotes } = useNotes(project?.notes || "", projectId);

    const { canEdit } = useCurrentMemberRole(projectId, project?.userId);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    const handleViewAllParameters = () => {
        setActiveTab("parameters");
    };

    if (error) {
        return (
            <div className="w-full h-full bg-gray-50 p-5 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <OverviewTab
                        project={project}
                        isLoading={isLoading}
                        notes={notes}
                        onNotesChange={setNotes}
                        onViewAllParameters={handleViewAllParameters}
                        canEdit={canEdit}
                    />
                );
            case "parameters":
                return <ParametersTab />;
            case "parcels":
                return <ParcelsTab projectId={projectId} />;
            case "documents":
                return <DocumentsTab />;
            case "activities":
                return (
                    <ActivitiesTab
                        projectId={projectId}
                        projectName={project?.name}
                    />
                );
            case "members":
                return (
                    <MembersTab
                        projectId={projectId}
                        projectOwnerId={project?.userId}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col overflow-hidden font-inter">
            {/* Header (back + tabs + project info) */}
            <div className="flex-shrink-0 px-7 bg-white border-b border-gray-200 ">
                <ProjectHeader
                    name={project?.name || "----"}
                    isFavorite={isFavorite}
                    isLoading={isLoading}
                    activeTab={activeTab}
                    onBack={handleBack}
                    onToggleFavorite={toggleFavorite}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-7 pt-4 flex flex-col min-h-0">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ClientProjectPage;
