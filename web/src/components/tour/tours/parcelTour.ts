import { tourTarget, type TourDefinition } from "../tourTypes";

export const PARCEL_TOUR: TourDefinition = {
  id: "parcel",
  label: "Découvrir la fiche parcelle",
  priority: 10,
  steps: [
    {
      title: "La fiche parcelle",
      description: "Toutes les données publiques de la parcelle, rangées par thème. Voici comment vous y retrouver.",
    },
    {
      target: tourTarget("parcel-nav"),
      title: "Les rubriques",
      description:
        "<b>Bâti</b> : bâtiments, DPE, permis. <b>Habitat</b> : copropriété, loyers. <b>Foncier</b> : PLU et ventes DVF. <b>Environnement</b> : risques, pollution, météo, connexion.",
      side: "bottom",
    },
    {
      target: tourTarget("parcel-search"),
      title: "Aller droit au but",
      description: "Cherchez une rubrique par son nom, sans passer par les menus.",
      side: "bottom",
    },
    {
      target: tourTarget("parcel-content"),
      title: "La synthèse",
      description: "L’essentiel en un coup d’œil. Chaque carte ouvre la rubrique détaillée correspondante.",
      side: "top",
      align: "start",
    },
    {
      target: tourTarget("parcel-add"),
      title: "Garder la parcelle",
      description: "Ajoutez-la à un projet pour la retrouver, la comparer et la partager avec votre équipe.",
      side: "bottom",
      align: "end",
    },
    {
      target: tourTarget("parcel-close"),
      title: "Retour à la carte",
      description: "Revenez à la carte à tout moment, ou appuyez sur <kbd>Échap</kbd>.",
      side: "bottom",
      align: "end",
    },
  ],
};
