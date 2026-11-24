import { METEO_LABELS, type MeteoData } from "../../../../../../../requests/geoserver/worldClim";
import PanelCard from "../shared/PanelCard";
import { meteoValue } from "./meteoFormat";

type MeteoDetailsProps = {
  data: MeteoData;
  kind: "temperature" | "precipitation";
};

const KEYS: Record<MeteoDetailsProps["kind"], (keyof MeteoData)[]> = {
  temperature: ["temp_max_annuelle", "temp_min_annuelle", "temp_max_ete", "temp_min_ete", "temp_max_hiver", "temp_min_hiver"],
  precipitation: ["prec_max_mensuel", "prec_min_mensuel", "prec_ete_total", "prec_ete_moy", "prec_hiver_total", "prec_hiver_moy"],
};

const TITLES: Record<MeteoDetailsProps["kind"], string> = {
  temperature: "Températures",
  precipitation: "Précipitations",
};

export default function MeteoDetails({ data, kind }: MeteoDetailsProps) {
  return (
    <PanelCard title={TITLES[kind]} aside="Normales climatiques">
      <dl className="divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
        {KEYS[kind].map((key) => (
          <div key={key} className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="text-xs text-gray-500 dark:text-gray-400">{METEO_LABELS[key]}</dt>
            <dd className="text-xs font-medium text-gray-900 dark:text-white">{meteoValue(data, key)}</dd>
          </div>
        ))}
      </dl>
    </PanelCard>
  );
}
