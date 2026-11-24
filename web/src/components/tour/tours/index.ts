import type { TourDefinition, TourId } from "../tourTypes";
import { MAP_TOUR } from "./mapTour";
import { PARCEL_TOUR } from "./parcelTour";
import { PROJECT_TOUR, PROJECTS_TOUR } from "./projectTours";

const ADMIN_TOUR: TourDefinition = {
  id: "admin",
  label: "Découvrir l’administration",
  priority: 5,
  steps: [
    {
      target: "#admin-tabs-tour",
      title: "L’espace administrateur",
      description: "Réservé aux administrateurs : statistiques de la plateforme, comptes, rôles et retours des utilisateurs.",
      side: "right",
      align: "start",
    },
    { target: "#admin-users-tour", title: "Utilisateurs", description: "Consultez chaque compte, son activité et ses connexions.", side: "right" },
    { target: "#admin-admins-tour", title: "Administrateurs", description: "Donnez ou retirez les droits d’administration à partir d’un e-mail.", side: "right" },
    { target: "#admin-feedbacks-tour", title: "Retours & suggestions", description: "Lisez, filtrez et traitez les bugs et idées envoyés depuis l’application.", side: "right" },
  ],
};

export const TOURS: Record<TourId, TourDefinition> = {
  map: MAP_TOUR,
  parcel: PARCEL_TOUR,
  projects: PROJECTS_TOUR,
  project: PROJECT_TOUR,
  admin: ADMIN_TOUR,
};
