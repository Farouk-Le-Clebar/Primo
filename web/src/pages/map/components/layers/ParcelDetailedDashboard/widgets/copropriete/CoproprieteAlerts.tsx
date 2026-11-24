import type { Copropriete } from "../habitat/types";
import PanelCard from "../shared/PanelCard";
import { TONES } from "../shared/tones";
import { coproAlerts, type SocialShare } from "./data";

type CoproprieteAlertsProps = { coproprietes: Copropriete[]; social: Record<string, SocialShare> };

export default function CoproprieteAlerts({ coproprietes, social }: CoproprieteAlertsProps) {
  const named = coproprietes.length > 1;
  const alerts = coproprietes.flatMap((copro) =>
    coproAlerts(copro, social[copro.numero_immatriculation]).map((alert) => ({
      ...alert,
      key: `${copro.numero_immatriculation}-${alert.title}`,
      owner: named ? copro.nom_usage ?? copro.numero_immatriculation : null,
    })),
  );

  return (
    <PanelCard title="Points de vigilance" subtitle="Signaux issus du registre, à vérifier dans les PV d’assemblée générale">
      {alerts.length ? (
        <ul className="primo-stagger flex flex-col gap-2">
          {alerts.map(({ key, tone, title, detail, owner }) => (
            <li key={key} className={`rounded-lg px-3 py-2 ${TONES[tone]}`}>
              {owner && <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{owner}</p>}
              <p className="text-xs font-semibold">{title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed opacity-80">{detail}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Aucun signal particulier : syndic en fonction, pas d’aide Anah déclarée ni de quartier prioritaire.
        </p>
      )}
    </PanelCard>
  );
}
