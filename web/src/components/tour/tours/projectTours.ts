import { tourTarget, type TourDefinition } from "../tourTypes";

export const PROJECTS_TOUR: TourDefinition = {
  id: "projects",
  label: "Découvrir les projets",
  priority: 5,
  steps: [
    {
      target: tourTarget("projects-rail"),
      title: "Vos espaces projet",
      description: "Chaque projet regroupe des parcelles et une équipe. L’étoile épingle vos favoris en haut de la liste.",
      side: "right",
      align: "start",
    },
    {
      target: tourTarget("projects-new"),
      title: "Créer un projet",
      description: "Donnez-lui un nom et une description, puis ajoutez-y des parcelles depuis la carte.",
      side: "right",
    },
    {
      target: tourTarget("projects-filter"),
      title: "Retrouver un projet",
      description: "Filtrez la liste par nom quand vos projets se multiplient.",
      side: "right",
    },
  ],
};

export const PROJECT_TOUR: TourDefinition = {
  id: "project",
  label: "Découvrir un projet",
  priority: 6,
  steps: [
    {
      target: tourTarget("project-tabs"),
      title: "Les onglets du projet",
      description:
        "<b>Vue d’ensemble</b>, <b>Parcelles</b> (comparaison IA, export), <b>Membres</b>, <b>Documents</b>, <b>Notes</b>, <b>Jalons</b> et <b>Adresses</b> utiles.",
      side: "bottom",
      align: "start",
    },
    {
      target: tourTarget("project-tab-milestones"),
      title: "Les jalons",
      description: "Découpez le projet en étapes clés (visite, offre, compromis…) et validez-les pour suivre l’avancement.",
      side: "bottom",
    },
    {
      target: tourTarget("project-tab-documents"),
      title: "Les documents",
      description: "Partagez PDF, images ou fichiers Word avec les membres, jusqu’à 125 Mo par projet.",
      side: "bottom",
    },
    {
      target: tourTarget("project-invite"),
      title: "Travailler à plusieurs",
      description: "Invitez un collègue, un notaire ou un client par e-mail. Il sera prévenu de chaque nouveauté.",
      side: "bottom",
      align: "end",
    },
    {
      target: tourTarget("project-share"),
      title: "Partager le lien",
      description: "Copiez le lien du projet pour l’envoyer aux membres.",
      side: "bottom",
      align: "end",
    },
  ],
};
