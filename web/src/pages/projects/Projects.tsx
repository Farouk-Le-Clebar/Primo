import { useNavigate } from "react-router-dom";
import { ProjectsDashboard } from "./components/projects/ProjectsDashboard";
import ErrorCard from "./components/projects/ErrorCard";
import { AlertCircle } from "lucide-react";

export default function Projects() {
    const navigate = useNavigate();

    const handleProjectClick = (project: any) => {
        navigate(`/projects/${project.id}`);
    };

    const handleCreateNew = () => {
        navigate("/projects/new");
    };

    return (
        <div className="flex flex-col bg-cover bg-center">
            <ProjectsDashboard
                onProjectClick={handleProjectClick}
                onCreateNew={handleCreateNew}
                errorComponent={
                    <ErrorCard
                        message="Connectez-vous ou créez un compte pour retrouver vos projets"
                        secondaryText="Avec les projets, disposez d'espaces de travail personnalisés pour piloter efficacement chacune de vos réalisations."
                        icon={<AlertCircle />}
                    />
                }
            />
        </div>
    );
}

//TODO : ajouter une petite animation sur le panel de confirmation pour la suppression
//TODO : ajuster le design du panelFIlter
//TODO : ajouter petit modal qui s'ouvre quand on souhaite selectionner "map" ou "list" dans MapView
