import { Card } from "@tremor/react";

import {
  ROOF_MATERIALS,
  WALL_MATERIALS,
  getMaterialLabel,
} from "../../../../../../../utils/building-dictionaries";
import { BuildingThumbnail } from "./BuildingThumbnail";
import { buildingCardId, buildingColor } from "./config";
import { geometryArea } from "./geometry";
import { buildingYear, squareMeters, toNumber } from "./stats";
import type { BuildingFeature } from "./types";

type BuildingCardProps = {
  index: number;
  building: BuildingFeature;
  active: boolean;
  onHover: (index: number | null) => void;
};

const STATE_TONES: Record<string, string> = {
  "en service": "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  "en construction": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "en ruine": "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};
const DEFAULT_TONE = "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300";

const display = (value: number | null, unit = ""): string =>
  value == null ? "—" : `${value.toLocaleString("fr-FR")}${unit}`;

export function BuildingCard({ index, building, active, onHover }: BuildingCardProps) {
  const p = building.properties;
  const color = buildingColor(index);
  const stateTone = STATE_TONES[String(p.etat).toLowerCase()] ?? DEFAULT_TONE;
  const facts = [
    { label: "Emprise", value: squareMeters(geometryArea(building.geometry)) },
    { label: "Hauteur", value: display(toNumber(p.hauteur), " m") },
    { label: "Niveaux", value: display(toNumber(p.nb_etages)) },
    { label: "Logements", value: display(toNumber(p.nb_logts)) },
  ];
  const materials = [
    { label: "Murs", value: getMaterialLabel(p.mat_murs, WALL_MATERIALS) },
    { label: "Toiture", value: getMaterialLabel(p.mat_toits, ROOF_MATERIALS) },
  ];

  return (
    <Card
      id={buildingCardId(index)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`scroll-mt-4 rounded-xl border-gray-200 p-0 shadow-sm ring-0 transition-all duration-200 dark:border-white/10 dark:bg-[#171717] ${active ? "-translate-y-0.5 border-emerald-300 shadow-md dark:border-emerald-500/40" : ""}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 dark:border-white/5">
          <BuildingThumbnail feature={building} color={color} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <span className={`h-2 w-2 rounded-full ${color.dot}`} />
            Bâtiment {index + 1} · {p.nature || "Indifférencié"}
          </div>
          <h4 className="mt-1 truncate text-base font-semibold text-gray-900 dark:text-white">
            {p.usage1 || "Usage non renseigné"}
          </h4>
          {p.usage2 && (
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              Usage secondaire : {p.usage2}
            </p>
          )}
        </div>
        {p.etat && (
          <span className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${stateTone}`}>
            {p.etat}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-4 divide-x divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
        {facts.map(({ label, value }) => (
          <div key={label} className="min-w-0 px-3 py-3">
            <dt className="text-[11px] text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-2 p-4 text-xs">
        {materials.map(({ label, value }) => (
          <span key={label} className="rounded-md bg-gray-50 px-2 py-1 text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {label} · <span className="font-medium text-gray-900 dark:text-white">{value || "—"}</span>
          </span>
        ))}
        <span className="ml-auto text-gray-500 dark:text-gray-400">
          {buildingYear(p) ? `Apparu en ${buildingYear(p)}` : "Date d’apparition inconnue"}
        </span>
      </div>

      {p.ids_rnb && (
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-2.5 dark:border-white/5">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Identifiant RNB</span>
          <span className="truncate font-mono text-[11px] text-gray-700 dark:text-gray-300">
            {p.ids_rnb}
          </span>
        </div>
      )}
    </Card>
  );
}
