import PanelCard from "../shared/PanelCard";
import { TYPE_BIEN_LABELS, euroM2, type MarketRent } from "./data";

const position = (value: number, min: number, max: number): string => `${((value - min) / (max - min || 1)) * 100}%`;

export default function MarketRents({ rents }: { rents: MarketRent[] }) {
  const lows = rents.map((rent) => rent.low ?? rent.m2);
  const highs = rents.map((rent) => rent.high ?? rent.m2);
  const min = Math.floor(Math.min(...lows));
  const max = Math.ceil(Math.max(...highs));
  const year = rents[0]?.year;

  return (
    <PanelCard title="Loyers de marché dans la commune" subtitle={`Annonces ${year ?? ""} · charges comprises · logement non meublé`}>
      <ul className="primo-stagger flex flex-col gap-4">
        {rents.map((rent) => (
          <li key={rent.type} className="text-xs">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-gray-700 dark:text-gray-200">{TYPE_BIEN_LABELS[rent.type]}</span>
              <span className="font-semibold tabular-nums text-gray-900 dark:text-white">{euroM2(rent.m2)}</span>
            </div>
            <div className="relative h-2 rounded-full bg-gray-100 dark:bg-white/5">
              {rent.low !== null && rent.high !== null && (
                <span
                  className="absolute inset-y-0 rounded-full bg-sky-500/25"
                  style={{ left: position(rent.low, min, max), right: `calc(100% - ${position(rent.high, min, max)})` }}
                />
              )}
              <span className="absolute -top-0.5 h-3 w-1 -translate-x-1/2 rounded-full bg-sky-600" style={{ left: position(rent.m2, min, max) }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between text-[11px] tabular-nums text-gray-400">
        <span>{euroM2(min)}</span>
        <span>{euroM2(max)}</span>
      </div>
    </PanelCard>
  );
}
