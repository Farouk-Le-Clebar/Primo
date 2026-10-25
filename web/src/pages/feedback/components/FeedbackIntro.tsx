import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

const SUPPORT_URL = "https://chat.whatsapp.com/FKq0VLrFo4u33nFyFWhaRn";

const STEPS = [
  { title: "Lu par l'équipe", description: "Chaque retour arrive directement chez nous." },
  { title: "Priorisé", description: "Les bugs bloquants passent en premier." },
  { title: "Livré", description: "Les améliorations rejoignent les prochaines versions." },
];

export default function FeedbackIntro() {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-medium tracking-[0.12em] text-gray-400 uppercase">Retours et suggestions</p>
      <h2 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Aidez-nous à construire le Primo dont vous avez besoin.
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Signalez un bug ou proposez une fonctionnalité. Plus vous êtes précis, plus vite nous pouvons agir.
      </p>
      <ol className="mt-8 max-w-sm space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10 text-[11px] font-medium text-gray-500 dark:border-white/15 dark:text-gray-400">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
              <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex w-fit items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        Besoin d'une réponse rapide ? Rejoindre le support
        <ArrowUpRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}
