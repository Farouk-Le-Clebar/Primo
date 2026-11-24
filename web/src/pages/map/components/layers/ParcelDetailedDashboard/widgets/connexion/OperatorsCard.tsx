import type { ReseauMobile } from "../../../../../../../types/environnement";
import PanelCard from "../shared/PanelCard";
import { TONES } from "../shared/tones";
import { formatDistance } from "../shared/useParcelPoint";

const generationTone = (generation: string | null): string =>
  generation === "5G" ? TONES.emerald : generation === "4G" ? TONES.sky : TONES.gray;

export default function OperatorsCard({ mobile }: { mobile: ReseauMobile | null }) {
  return (
    <PanelCard title="Réseau mobile par opérateur" aside={mobile ? `Rayon ${mobile.rayonMetres / 1000} km` : "Indisponible"}>
      {!mobile ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">Les antennes ANFR sont momentanément indisponibles.</p>
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[11px] text-gray-500 dark:text-gray-400">
              <th className="py-2 font-medium">Opérateur</th>
              <th className="py-2 font-medium">Réseau</th>
              <th className="py-2 text-right font-medium">4G</th>
              <th className="py-2 text-right font-medium">5G</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-y border-gray-100 dark:divide-white/5 dark:border-white/5">
            {mobile.operateurs.map((operator) => (
              <tr key={operator.operateur}>
                <td className="py-2.5 font-medium text-gray-900 dark:text-white">{operator.operateur}</td>
                <td className="py-2.5">
                  <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${generationTone(operator.meilleureGeneration)}`}>
                    {operator.meilleureGeneration ?? "Aucun"}
                  </span>
                </td>
                <td className="py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-200">{formatDistance(operator.distance4gMetres)}</td>
                <td className="py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-200">{formatDistance(operator.distance5gMetres)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        Distance à l’antenne active la plus proche. Une antenne proche indique une bonne couverture extérieure, sans la garantir à l’intérieur.
      </p>
    </PanelCard>
  );
}
