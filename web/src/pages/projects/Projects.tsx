import { useNavigate } from "react-router-dom";
import { ClientProjectsDashboard } from "./components/projects/ClientProjectsDashboard";

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
            <ClientProjectsDashboard
                onProjectClick={handleProjectClick}
                onCreateNew={handleCreateNew}
            />
        </div>
    );
}

//TODO : ajouter une petite animation sur le panel de confirmation pour la suppression
//TODO : ajuster le design du panelFIlter
//TODO : ajouter petit modal qui s'ouvre quand on souhaite selectionner "map" ou "list" dans MapView
//TODO : améliorer le tableau pour que le titre des projets n'influence pas la taille des colonnes