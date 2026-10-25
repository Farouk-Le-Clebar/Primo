// Team portraits live in src/assets/images/team/<slug>.jpg (square). Without a photo, initials are shown.
export type TeamMember = { name: string; initials: string; slug: string; linkedin: string };

export const TEAM: TeamMember[] = [
  {
    name: 'Jacques Sapin',
    initials: 'JS',
    slug: 'jacques-sapin',
    linkedin: 'https://www.linkedin.com/in/jacques-sapin-863630267/',
  },
  {
    name: 'Felix Schrynemaekers',
    initials: 'FS',
    slug: 'felix-schrynemaekers',
    linkedin: 'https://www.linkedin.com/in/felix-schrynemakers-2469b53a5/?skipRedirect=true',
  },
  {
    name: 'Louis Huguet',
    initials: 'LH',
    slug: 'louis-huguet',
    linkedin: 'https://www.linkedin.com/in/louis-huguet-594b063b5/',
  },
  {
    name: 'Antonin Campi',
    initials: 'AC',
    slug: 'antonin-campi',
    linkedin: 'https://www.linkedin.com/in/antonin-campi/',
  },
];
