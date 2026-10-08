import { Badge, Card } from "@tremor/react";
import {
  Activity,
  Building2,
  Factory,
  MapPin,
  Mountain,
  Radiation,
  ShieldAlert,
  Waves,
} from "lucide-react";
import type { RiskCardData } from "./riskCards";

function riskIcon(title: string) {
  if (/inond|nappe|barrage/i.test(title)) return Waves;
  if (/s[ée]ism/i.test(title)) return Activity;
  if (/radon/i.test(title)) return Radiation;
  if (/terrain|avalanche/i.test(title)) return Mountain;
  if (/industri|technolog/i.test(title)) return Factory;
  return ShieldAlert;
}

export default function GeorisqueCard({ risk }: { risk: RiskCardData }) {
  const Icon = riskIcon(risk.title);
  const isLowRisk = /^(?:[12]\s*-\s*)?(?:tr[eè]s\s+)?faible$/i.test(
    risk.communalStatus.trim(),
  );
  return (
    <Card className="flex h-full flex-col rounded-xl border-gray-200 p-5 font-inter shadow-sm ring-0 dark:border-white/10 sm:p-6">
      <div className="flex min-h-16 items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Icon size={30} aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
          {risk.title}
        </h3>
      </div>
      <dl className="my-6 space-y-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <MapPin size={18} aria-hidden="true" />
            Sur la parcelle
          </dt>
          <dd>
            <Badge className="georisques-status georisques-status-unknown">Non déterminé</Badge>
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <dt className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Building2 size={18} aria-hidden="true" />
            Dans la commune
          </dt>
          <dd>
            <Badge
              className={
                isLowRisk
                  ? "georisques-status georisques-status-low"
                  : risk.identified && risk.communalStatus === "Recensé"
                  ? "georisques-status georisques-status-identified"
                  : "georisques-status georisques-status-unknown"
              }
            >
              {risk.communalStatus}
            </Badge>
          </dd>
        </div>
      </dl>
        <ul className="mt-2 list-disc space-y-2 pl-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {risk.details.map((detail, i) => (
            <li key={i}>{detail}</li>
          ))}
        </ul>
    </Card>
  );
}
