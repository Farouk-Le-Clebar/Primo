import LoadingPrimoLogo from "./LoadingPrimoLogo";

type PrimoSplashProps = {
  label?: string;
};

export default function PrimoSplash({ label = "Chargement" }: PrimoSplashProps) {
  return (
    <div role="status" aria-label={label} className="flex flex-col items-center">
      <LoadingPrimoLogo className="h-12 w-12 text-gray-900 dark:text-white" />
      <span className="mt-5 text-sm font-semibold tracking-tight text-gray-900 dark:text-white">Primo</span>
      <div className="mt-4 h-0.5 w-28 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
        <div className="primo-progress-bar h-full w-2/5 rounded-full bg-gray-900 dark:bg-white" />
      </div>
      <span className="mt-3 text-xs text-gray-400">{label}</span>
    </div>
  );
}
