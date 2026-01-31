import { ClientProjectsDashboard } from './components/ClientProjectsDashboard';

export default function Projects() {
  const handleProjectClick = (project: any) => {
    console.log('Ouvrir le projet:', project.id);
    // TODO: Naviguer vers la page de détails
    // navigate(`/projects/${project.id}`);
  };

  const handleCreateNew = () => {
    console.log('Créer un nouveau projet');
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


//TODO : régler bug des tris & icon par nbr parcelles & paramètres : on dirait que ça ne peut pas fonctionner de manière indépendante
//TODO : ajouter pastille coloré sur item filtre quand filtre en cours
//TODO : ajuster le style général (taille, typo, etc...)
