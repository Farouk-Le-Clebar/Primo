import type { DriveStep } from "driver.js";

export const adminSteps: DriveStep[] = [
  {
    element: '#admin-header-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Bienvenue dans l'Administration</h4>
          <p class="p-tour-description">Cet espace sécurisé est réservé aux dirigeants. Il vous permet de superviser l'ensemble de l'activité sur la plateforme.</p>
        </div>
      `,
      side: "bottom",
      align: 'start'
    }
  },
  {
    element: '#admin-overview-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Aperçu & Statistiques</h4>
          <p class="p-tour-description">Consultez l'évolution des inscriptions et analysez les métriques clés de l'application via des graphiques détaillés.</p>
        </div>
      `,
      side: "bottom",
      align: 'center'
    }
  },
  {
    element: '#admin-users-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Gestion des Utilisateurs</h4>
          <p class="p-tour-description">Accédez à la liste complète de vos clients. Vous pouvez y vérifier leurs informations, modifier leurs statuts ou bannir des comptes si nécessaire.</p>
        </div>
      `,
      side: "bottom",
      align: 'center'
    }
  },
  {
    element: '#admin-admins-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Équipe d'Administrateurs</h4>
          <p class="p-tour-description">Gérez les privilèges d'accès. Ajoutez de nouveaux collaborateurs ou révoquez les droits d'administration de certains membres.</p>
        </div>
      `,
      side: "bottom",
      align: 'center'
    }
  },
  {
    element: '#admin-feedbacks-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Retours & Suggestions</h4>
          <p class="p-tour-description">Lisez les retours d'expérience de vos utilisateurs pour prioriser les futurs besoins et corriger les anomalies signalées.</p>
        </div>
      `,
      side: "bottom",
      align: 'center'
    }
  }
];