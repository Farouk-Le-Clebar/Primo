import type { DriveStep } from "driver.js";

export const dashboardSteps: DriveStep[] = [
  {
    element: '#search-bar-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Recherche de parcelles</h4>
          <p class="p-tour-description">Entrez une adresse pour localiser immédiatement un terrain sur la carte.</p>
        </div>
      `,
      side: "bottom",
      align: 'end'
    }
  },
  {
    element: '#notifications-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Projets & Notifications</h4>
          <p class="p-tour-description">Suivez l'état d'avancement de vos dossiers et recevez des alertes sur les nouvelles parcelles disponibles.</p>
        </div>
      `,
      side: "bottom",
      align: 'end'
    }
  },
  {
    element: '#sidebar-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Navigation fluide</h4>
          <p class="p-tour-description">Utilisez la barre latérale pour naviguer entre la carte et votre tableau de bord projet.</p>
        </div>
      `,
      side: "right",
      align: 'start'
    }
  },
  {
    element: '#sidebar-projects-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Gestion de projets</h4>
          <p class="p-tour-description">Accédez à votre gestionnaire de projets pour suivre vos projets en cours et consulter les détails.</p>
        </div>
      `,
      side: "right",
      align: 'start'
    }
  },
  {
    element: '#sidebar-map-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Carte interactive</h4>
          <p class="p-tour-description">Explorez la carte pour découvrir les terrains disponibles et visualiser les détails de chaque parcelle.</p>
        </div>
      `,
      side: "right",
      align: 'start'
    }
  }
];