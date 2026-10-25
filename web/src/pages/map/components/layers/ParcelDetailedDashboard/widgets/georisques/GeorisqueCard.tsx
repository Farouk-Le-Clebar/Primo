import { Card } from "@tremor/react";
import { Activity, Factory, Mountain, Radiation, ShieldAlert, Waves, type LucideIcon } from "lucide-react";

import { TONES } from "../shared/tones";
import type { RiskCardData } from "./riskCards";

const RISK_ICONS: [RegExp, LucideIcon, string][] = [
  [/inond|nappe|barrage/i, Waves, TONES.sky],
  [/s[ée]ism/i, Activity, TONES.violet],
  [/radon/i, Radiation, TONES.amber],
  [/terrain|avalanche|argile/i, Mountain, TONES.amber],
  [/industri|technolog/i, Factory, TONES.rose],
];

const riskStyle = (title: string): [LucideIcon, string] => {
  const match = RISK_ICONS.find(([pattern]) => pattern.test(title));
  return match ? [match[1], match[2]] : [ShieldAlert, TONES.gray];
};

const LOW_RISK = /^(?:[12]\s*-\s*)?(?:tr[eè]s\s+)?faible$/i;

const statusTone = (risk: RiskCardData): string =>
  LOW_RISK.test(risk.communalStatus.trim())
    ? TONES.emerald
    : risk.identified && risk.communalStatus === "Recensé"
      ? TONES.amber
      : TONES.gray;

export default function GeorisqueCard({ risk }: { risk: RiskCardData }) {
  const [Icon, tone] = riskStyle(risk.title);

  return (
    <Card className="rounded-xl border-gray-200 p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <div className="flex items-center gap-3 p-4">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon size={18} />
        </span>
        <h4 className="min-w-0 flex-1 text-sm font-semibold text-gray-900 dark:text-white">{risk.title}</h4>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
        <div className="px-4 py-2.5">
          <dt className="text-[11px] text-gray-500 dark:text-gray-400">Dans la commune</dt>
          <dd className="mt-1">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${statusTone(risk)}`}>{risk.communalStatus}</span>
          </dd>
        </div>
        <div className="px-4 py-2.5">
          <dt className="text-[11px] text-gray-500 dark:text-gray-400">Sur la parcelle</dt>
          <dd className="mt-1">
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${TONES.gray}`}>Non déterminé</span>
          </dd>
        </div>
      </dl>
      <ul className="list-disc space-y-1 py-3 pl-8 pr-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {risk.details.map((detail, i) => (
          <li key={i}>{detail}</li>
        ))}
      </ul>
    </Card>
  );
}
