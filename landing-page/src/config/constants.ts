export const EXTERNAL_LINKS = {
  BETA_FORM:
    "https://docs.google.com/forms/d/e/1FAIpQLSdJmNDDhunKox0XS8WZWfG2Wof7ue87fxCvxv_ch98r98cA-g/viewform?usp=header",
  APP_URL: "https://app.primo-data.fr/",
  LINKEDIN: "https://www.linkedin.com/company/primo-data-app/",
  EMAIL: "mailto:contact@primo-data.fr",
} as const;

export const NAV_ITEMS = [
  { id: "home", label: "Accueil" },
  { id: "features", label: "Fonctionnalités" },
  { id: "services", label: "Services" },
  { id: "about", label: "À propos" },
] as const;

export const SITE_META = {
  NAME: "Primo",
  TAGLINE: "Primo.",
  DOMAIN: "https://primo-data.fr",
  DESCRIPTION:
    "Primo centralise toutes les informations cadastrales, urbanisme, risques et qualité de vie d'une parcelle en un clic.",
  CURRENT_YEAR: new Date().getFullYear(),
} as const;

export const CTA_TEXTS = {
  BETA_TITLE: "Rejoignez la bêta de Primo",
  BETA_DESCRIPTION:
    "L'application n'est pas encore disponible publiquement. Inscrivez-vous dès maintenant pour être parmi les premiers à découvrir Primo et accéder à toutes les données de vos parcelles.",
  BETA_BUTTON: "S'inscrire à la bêta",
  DISCOVER_PRIMO: "Découvrir Primo",
  ACCESS_BETA: "Accéder à la beta",
} as const;
