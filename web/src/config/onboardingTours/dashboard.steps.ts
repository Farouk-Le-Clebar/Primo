import type { DriveStep } from "driver.js";

export const dashboardSteps: DriveStep[] = [
  {
    element: '#sidebar-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Bienvenue sur Primo</h4>
          <p class="p-tour-description">Ceci est votre menu de navigation principal. Il vous permet d'accéder rapidement à tous vos outils d'analyse foncière.</p>
        </div>
      `,
      side: "right",
      align: 'start'
    }
  },
  {
    element: '#sidebar-overview-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Aperçu & Statistiques</h4>
          <p class="p-tour-description">Retrouvez ici un tableau de bord global résumant vos activités récentes et l'état de vos recherches.</p>
        </div>
      `,
      side: "right",
      align: 'center'
    }
  },
  {
    element: '#sidebar-search-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Recherche rapide</h4>
          <p class="p-tour-description">Ouvrez ce panneau pour cibler immédiatement une adresse précise et la localiser sur la carte interactive.</p>
        </div>
      `,
      side: "right",
      align: 'center'
    }
  },
  {
    element: '#sidebar-ai-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Assistant Intelligence Artificielle</h4>
          <p class="p-tour-description">Posez des questions complexes et générez des analyses poussées sur le cadastre grâce à notre IA intégrée.</p>
        </div>
      `,
      side: "right",
      align: 'center'
    }
  },
  {
    element: '#sidebar-project-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Vos espaces de travail</h4>
          <p class="p-tour-description">C'est ici que sont classées toutes les parcelles que vous sauvegardez. Organisez-les par projets pour un suivi optimal.</p>
        </div>
      `,
      side: "right",
      align: 'center'
    }
  },
  {
    element: '#sidebar-map-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Cartographie</h4>
          <p class="p-tour-description">Explorez librement le territoire, appliquez des filtres environnementaux et consultez le détail des parcelles de manière visuelle.</p>
        </div>
      `,
      side: "right",
      align: 'center'
    }
  },
  {
    element: '#sidebar-projects-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Votre bibliothèque de projets</h4>
          <p class="p-tour-description">C'est ici que sont listés tous vos projets. Chaque projet regroupe les parcelles que vous avez sauvegardées, ainsi que les analyses et notes associées. Organisez-les par thématique ou par dossier pour un accès rapide.</p>
        </div>
      `,
      side: "right",
      align: 'center'
    }
  },
  {
    element: '#sidebar-user-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Profil & Paramètres</h4>
          <p class="p-tour-description">Gérez votre compte, votre facturation, et modifiez vos préférences visuelles (Thème clair, sombre ou système).</p>
        </div>
      `,
      side: "right",
      align: 'end'
    }
  },
  {
    element: '#notifications-tour',
    popover: {
      title: '',
      description: `
        <div class="p-tour-content">
          <h4 class="p-tour-title">Alertes & Notifications</h4>
          <p class="p-tour-description">Soyez informé en temps réel des nouveautés de la plateforme et des mises à jour sur vos dossiers en cours.</p>
        </div>
      `,
      side: "bottom",
      align: 'end'
    }
  }
];