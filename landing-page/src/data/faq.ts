// FAQ shown on the landing page and exposed as schema.org FAQPage. `answer` may contain inline HTML (links).
export type FaqItem = { question: string; answer: string };

export const FAQ: FaqItem[] = [
  {
    question: 'Comment rechercher une parcelle cadastrale avec Primo ?',
    answer:
      'Choisissez une commune, réglez vos critères (surface du terrain, surface bâtie, climat, zones inondables), puis cliquez sur une parcelle de la carte pour ouvrir sa fiche.',
  },
  {
    question: 'Quelles données consulter sur une parcelle ?',
    answer:
      'La fiche réunit les informations disponibles sur la parcelle et les bâtiments : diagnostic de performance énergétique (DPE), demandes de valeurs foncières (DVF), plan local d’urbanisme (PLU) et risques naturels. La couverture et la date de mise à jour dépendent des sources disponibles.',
  },
  {
    question: 'Comment partager une sélection de terrains avec mon équipe ?',
    answer:
      'Créez un projet et invitez vos collaborateurs par e-mail. Les parcelles que vous y ajoutez sont visibles par tous les membres du projet.',
  },
  {
    question: 'Une parcelle cadastrale est-elle forcément constructible ?',
    answer:
      'Non. Le cadastre permet d’identifier une parcelle ; il ne suffit pas à établir sa constructibilité. Les règles d’urbanisme, les servitudes et les contraintes locales doivent être vérifiées auprès des services compétents avant de vous engager. <a class="text-link" href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1633">Comprendre le certificat d’urbanisme sur Service Public</a>.',
  },
];

export const faqSchema = (items: FaqItem[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer.replace(/<[^>]+>/g, '') },
  })),
});
