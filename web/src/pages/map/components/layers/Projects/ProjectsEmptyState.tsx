export default function ProjectsEmptyState() {
  return (
    <div className="flex flex-1 flex-col justify-center px-12">
      <p className="text-xs font-medium tracking-[0.12em] text-gray-400 uppercase">Espace projet</p>
      <h2 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Choisissez un projet pour l'ouvrir à côté de la carte.
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Vue d'ensemble, parcelles, membres et documents restent accessibles sans quitter votre zone d'étude.
      </p>
    </div>
  );
}
