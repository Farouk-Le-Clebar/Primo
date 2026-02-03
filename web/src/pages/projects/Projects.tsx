import { useNavigate } from "react-router-dom";
import { ClientProjectsDashboard } from "./components/projects/ClientProjectsDashboard";

export default function Projects() {
    const navigate = useNavigate();

    const handleProjectClick = (project: any) => {
        navigate(`/projects/${project.id}`);
    };

    const handleCreateNew = () => {
        console.log("Créer un nouveau projet");
        // TODO: Naviguer vers la page de création
        // navigate('/projects/new');
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
//TODO : régler bug des tris & icon par nbr parcelles & paramètres : on dirait que ça ne peut pas fonctionner de manière indépendante
//TODO : ajuster le style général (taille, typo, etc...)
//TODO : ajuster le design du panelFIlter
//TODO : sur "fonctionnalité à venir" du compare : ajouter animation comme google pour IA quand on hover
//TODO : ajouter une petite animation au moment de l'ajout aux favoris d'un projet
//TODO : ajouter petit modal qui s'ouvre quand on souhaite selectionner "map" ou "list" dans MapView
