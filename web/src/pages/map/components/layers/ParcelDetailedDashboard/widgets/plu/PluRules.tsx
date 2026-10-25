import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";
import PanelCard from "../shared/PanelCard";
import type { GpuKind, PluRule } from "./types";

type PluRulesProps = {
  title: string;
  subtitle: string;
  empty: string;
  rules: PluRule[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

const KIND_LABELS: Record<GpuKind, string> = {
  surface: "Surfacique",
  lineaire: "Linéaire",
  ponctuel: "Ponctuel",
};

export default function PluRules({ title, subtitle, empty, rules, isLoading, isError }: PluRulesProps) {
  const count = rules?.length ?? 0;

  return (
    <PanelCard flush title={title} subtitle={subtitle} aside={count ? `${count} élément${count > 1 ? "s" : ""}` : undefined}>
      <div className="mt-3 border-t border-gray-100 dark:border-white/5">
        {isLoading ? (
          <div className="flex items-center gap-2 px-4 py-6">
            <LoadingPrimoLogo className="h-5 w-5" />
            <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">Interrogation du Géoportail…</span>
          </div>
        ) : !count ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {isError ? "Données momentanément indisponibles." : empty}
          </p>
        ) : (
          <ul className="primo-stagger">
            {rules?.map(({ key, code, label, description, kind, icon: Icon, tone }) => (
              <li key={key} className="grid grid-cols-[auto_1fr_auto] items-start gap-4 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-white/5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-md ${tone}`}>
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-[11px] font-medium text-gray-700 dark:text-gray-300">{code}</span>
                  <span className="block text-[10px] text-gray-500 dark:text-gray-400">{KIND_LABELS[kind]}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PanelCard>
  );
}
