import { tourTarget, type TourDefinition } from "../tourTypes";

export const MAP_TOUR: TourDefinition = {
  id: "map",
  label: "Découvrir la carte",
  priority: 1,
  steps: [
    {
      title: "Bienvenue sur Primo",
      description:
        "Cadastre, ventes immobilières, DPE, urbanisme, risques : tout est réuni sur une seule carte. <b>Une minute</b> pour faire le tour de l’essentiel.",
    },
    {
      target: tourTarget("map-search"),
      title: "Trouver une adresse",
      description: "Tapez une adresse ou une ville : la carte s’y rend et sélectionne la parcelle. Raccourci clavier : <kbd>⌘ K</kbd>.",
      side: "bottom",
      align: "start",
    },
    {
      target: tourTarget("map-layers"),
      title: "Fond de carte et position",
      description: "Passez du plan au satellite, ou recentrez la carte sur votre position.",
      side: "left",
    },
    {
      target: tourTarget("map-ai"),
      title: "Chercher avec l’IA",
      description: "Décrivez ce que vous cherchez en langage naturel, par exemple « une ville en bord de mer sous 3 000 €/m² ».",
      side: "left",
    },
    {
      target: tourTarget("map-poi"),
      title: "Points d’intérêt",
      description: "Affichez écoles, commerces, santé ou transports autour de vous, et les adresses enregistrées dans vos projets.",
      side: "left",
    },
    {
      target: tourTarget("nav-projects"),
      title: "Vos projets",
      description: "Regroupez parcelles, documents, notes et jalons dans un espace partagé avec votre équipe.",
      side: "bottom",
    },
    {
      target: tourTarget("news-bell"),
      title: "Nouveautés",
      description: "Invitations et activité de vos projets arrivent ici : parcelle ajoutée, document déposé, jalon validé…",
      side: "bottom",
      align: "end",
    },
    {
      target: tourTarget("tour-button"),
      title: "Revoir un guide",
      description: "Ce bouton relance à tout moment le guide de la page où vous vous trouvez.",
      side: "bottom",
      align: "end",
    },
    {
      target: tourTarget("user-menu"),
      title: "Votre compte",
      description: "Profil, thème clair ou sombre, retours et suggestions : tout se règle depuis ce menu.",
      side: "bottom",
      align: "end",
    },
    {
      title: "À vous de jouer",
      description:
        "Cliquez sur une parcelle de la carte : une fiche s’ouvre en bas de l’écran. <b>Analyse complète</b> affiche ensuite toutes ses données.",
    },
  ],
};
