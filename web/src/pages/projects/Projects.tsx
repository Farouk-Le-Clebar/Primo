import { useNavigate } from "react-router-dom";
import { ProjectsDashboard } from "./components/projects/ProjectsDashboard";

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
            />
        </div>
    );
}

//TODO : ajouter une petite animation sur le panel de confirmation pour la suppression
//TODO : ajuster le design du panelFIlter
//TODO : ajuster le design du bouton de changement de view dans MapView pour avoir qqchose de clean comme Apple
