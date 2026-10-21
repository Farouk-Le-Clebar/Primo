export const CONTACT_EMAIL = 'contact@primo-data.fr';

export const EXTERNAL_LINKS = {
  BETA_FORM:
    'https://docs.google.com/forms/d/e/1FAIpQLSdJmNDDhunKox0XS8WZWfG2Wof7ue87fxCvxv_ch98r98cA-g/viewform?usp=header',
  APP_URL: 'https://app.primo-data.fr/',
  LINKEDIN: 'https://www.linkedin.com/company/primo-data-app/',
  INSTAGRAM: 'https://www.instagram.com/primo.app/',
  EMAIL: `mailto:${CONTACT_EMAIL}`,
} as const;

// Landing page sections, shared by the landing header and the navbar / footer of the other pages.
export const NAV_ITEMS = [
  { id: 'fonctionnalites', label: 'Fonctionnalités' },
  { id: 'projets', label: 'Collaboration' },
  { id: 'equipe', label: 'Équipe' },
  { id: 'contact', label: 'Contact' },
] as const;

export const LEGAL_LINKS = [
  { href: '/mentions-legales/', label: 'Mentions légales' },
  { href: '/confidentialite/', label: 'Confidentialité' },
  { href: '/cgu/', label: 'CGU' },
] as const;

export const SITE_META = {
  NAME: 'Primo',
  DOMAIN: 'https://primo-data.fr',
  DESCRIPTION:
    'Primo centralise les données cadastrales, l’urbanisme, les risques et les informations foncières pour préparer votre projet.',
  DEFAULT_OG_IMAGE: '/images/og-primo.jpg',
  THEME_COLOR: { light: '#ffffff', dark: '#101513' },
} as const;

export const CTA_TEXTS = {
  BETA_TITLE: 'Rejoignez la bêta de Primo',
  BETA_DESCRIPTION:
    "L'application n'est pas encore disponible publiquement. Inscrivez-vous dès maintenant pour être parmi les premiers à découvrir Primo et accéder à toutes les données de vos parcelles.",
  BETA_BUTTON: "S'inscrire à la bêta",
  DISCOVER_PRIMO: 'Découvrir Primo',
  ACCESS_BETA: 'Accéder à la beta',
} as const;
