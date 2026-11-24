import { Droplets, Snowflake, Sun, Thermometer } from "lucide-react";

import type { MeteoData } from "../../../../../../../requests/geoserver/worldClim";
import KpiGrid, { type Kpi } from "../shared/KpiGrid";
import { KPI_TONES } from "../shared/tones";
import { meteoValue } from "./meteoFormat";

export default function MeteoKpis({ data }: { data: MeteoData }) {
  const kpis: Kpi[] = [
    { label: "Température annuelle", value: meteoValue(data, "temp_moy_annuelle"), hint: "Moyenne sur l'année", icon: Thermometer, tone: KPI_TONES.amber },
    { label: "Précipitations", value: meteoValue(data, "prec_annuelles"), hint: "Cumul annuel moyen", icon: Droplets, tone: KPI_TONES.sky },
    { label: "Été", value: meteoValue(data, "temp_moy_ete"), hint: `Max absolu : ${meteoValue(data, "temp_max_abs_ete")}`, icon: Sun, tone: KPI_TONES.rose },
    { label: "Hiver", value: meteoValue(data, "temp_moy_hiver"), hint: `Min absolu : ${meteoValue(data, "temp_min_abs_hiver")}`, icon: Snowflake, tone: KPI_TONES.violet },
  ];

  return <KpiGrid kpis={kpis} />;
}
