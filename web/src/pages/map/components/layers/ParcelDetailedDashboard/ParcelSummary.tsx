import { prepareDvf, median } from "./widgets/dvf/data";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, Metric, Text, Title } from "@tremor/react";
import { ArrowUpRight, Building2, FileText, Landmark, Zap } from "lucide-react";
import { getBuildingsByGeometry } from "../../../../../requests/geoserver/bdTopo";
import { getZonesUrbaByGeometry } from "../../../../../requests/geoserver/urbanAreas";
import { getDpeBan } from "../../../../../requests/dpe/information";
import { getDvfParcelle } from "../../../../../requests/dvf/information";
import { extractDepartement } from "./widgets/plu/utils";
import { getDpeColors, ORDERED_LABELS } from "./widgets/dpe/utils";

type RecordData = Record<string, string | number | null | undefined>;
type Feature = {
  id?: string;
  geometry?: Parameters<typeof getBuildingsByGeometry>[0];
  properties?: RecordData;
};
type Props = {
  feature: Feature;
  banId?: string;
  onNavigate: (tab: string) => void;
};
const number = (value: unknown) => {
  if (value == null || String(value).trim() === "") return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};
const format = (value: number | null, suffix = "") =>
  value == null
    ? "—"
    : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}${suffix}`;
const records = (data: unknown): RecordData[] =>
  Array.isArray(data) ? data : [];

function SummaryCard({
  title,
  source,
  icon,
  loading,
  error,
  missing,
  empty,
  retry,
  onOpen,
  children,
}: {
  title: string;
  source: string;
  icon: ReactNode;
  loading: boolean;
  error: boolean;
  missing: boolean;
  empty: string;
  retry: () => void;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <Card className="flex min-w-0 flex-col rounded-xl border-gray-200 bg-white p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/5">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-gray-50 p-2 text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {icon}
          </span>
          <div>
            <Title className="text-sm font-semibold dark:text-white">
              {title}
            </Title>
            <Text className="text-xs">{source}</Text>
          </div>
        </div>
        <button
          onClick={onOpen}
          aria-label={`Voir les détails : ${title}`}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:hover:bg-white/10"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>
      <div
        className="flex min-h-56 flex-1 flex-col p-5"
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <div role="status" className="space-y-4">
            <span className="sr-only">Chargement de {title}</span>
            <div className="h-9 w-28 animate-pulse rounded bg-gray-100 dark:bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-white/10" />
            <div className="h-16 animate-pulse rounded bg-gray-50 dark:bg-white/5" />
          </div>
        ) : error ? (
          <div className="my-auto">
            <Text>Les données ne sont pas disponibles pour le moment.</Text>
            <button
              onClick={retry}
              className="mt-3 text-sm font-medium text-emerald-700 underline dark:text-emerald-400"
            >
              Réessayer
            </button>
          </div>
        ) : missing ? (
          <div className="my-auto">
            <Metric className="text-gray-300 dark:text-gray-600">—</Metric>
            <Text className="mt-3">{empty}</Text>
          </div>
        ) : (
          children
        )}
      </div>
      <button
        onClick={onOpen}
        className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-left text-xs font-medium text-gray-600 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:border-white/5 dark:text-gray-300 dark:hover:bg-white/5"
      >
        Explorer {title === "Bâtiments" ? "les bâtiments" : `le ${title}`}
        <ArrowUpRight size={14} />
      </button>
    </Card>
  );
}

export default function ParcelSummary({ feature, banId, onNavigate }: Props) {
  const props = feature?.properties || {};
  const parcelId = String(props.id || "");
  const insee = String(props.commune || "");
  const department = insee
    ? insee.slice(0, insee.startsWith("97") ? 3 : 2)
    : extractDepartement(String(feature?.id)) || "";
  const spatialEnabled = !!feature?.geometry && !!department;
  const buildings = useQuery({
    queryKey: ["buildings-summary", parcelId],
    queryFn: () => getBuildingsByGeometry(feature.geometry, department),
    enabled: spatialEnabled,
    staleTime: 300000,
    retry: false,
  });
  const plu = useQuery({
    queryKey: ["urban-summary", parcelId],
    queryFn: () => getZonesUrbaByGeometry(feature.geometry, department),
    enabled: spatialEnabled,
    staleTime: 300000,
    retry: false,
  });
  const dpe = useQuery({
    queryKey: ["dpe-ban", banId],
    queryFn: () => getDpeBan(banId!),
    enabled: !!banId,
    staleTime: 300000,
    retry: false,
  });
  const dvf = useQuery({
    queryKey: ["dvf-parcelle", parcelId],
    queryFn: () => getDvfParcelle(parcelId),
    enabled: parcelId.length === 14,
    staleTime: 300000,
    retry: false,
  });
  const buildingList: Feature[] = buildings.data?.features || [];
  const zones: Feature[] = plu.data?.features || [];
  const diagnostics = records(dpe.data?.historique ?? dpe.data);
  const transactions = prepareDvf(dvf.data).records;
  const usages = [
    ...new Set(buildingList.map((b) => b.properties?.usage1).filter(Boolean)),
  ];
  const heights = buildingList
    .map((b) => number(b.properties?.hauteur))
    .filter((n): n is number => n != null && n > 0);
  const distribution = ORDERED_LABELS.map((label) => ({
    label,
    count: diagnostics.filter(
      (d) => String(d.etiquette_dpe).trim().toUpperCase() === label,
    ).length,
  }));
  const maxCount = Math.max(0, ...distribution.map((d) => d.count));
  const dominant = distribution
    .filter((d) => d.count === maxCount && d.count > 0)
    .map((d) => d.label);
  const ratios = transactions.flatMap((t) =>
    t.priceM2 !== null ? [t.priceM2] : [],
  );
  const medianPrice = median(ratios);
  const dates = transactions
    .map((t) => String(t.date_mutation || ""))
    .filter((d) => d && Number.isFinite(Date.parse(d)))
    .sort();
  const zoneLabels = [
    ...new Set(
      zones
        .map((z) => z.properties?.libelle || z.properties?.typezone)
        .filter(Boolean),
    ),
  ];
  const cardState = (query: typeof buildings) => ({
    loading: query.isLoading,
    error: query.isError,
    retry: () => {
      void query.refetch();
    },
  });

  return (
    <div className="space-y-6 pb-6">
      <Card className="rounded-xl border-gray-200 bg-white p-0 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]">
        <dl className="grid grid-cols-2 gap-y-5 p-5 lg:grid-cols-4">
          {[
            ["Surface cadastrale", format(number(props.contenance), " m²")],
            ["Commune · INSEE", insee || "—"],
            ["Section", String(props.section || "—")],
            ["Numéro de parcelle", String(props.numero || "—")],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 px-2">
              <dt className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </dt>
              <dd className="mt-2 truncate text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SummaryCard
          title="Bâtiments"
          source="IGN · BD TOPO"
          icon={<Building2 size={18} />}
          {...cardState(buildings)}
          missing={!buildingList.length}
          empty="Aucun bâtiment référencé dans les données disponibles sur cette parcelle."
          onOpen={() => onNavigate("batiments")}
        >
          <Metric className="dark:text-white">
            {buildingList.length}
            <span className="ml-2 text-sm font-normal text-gray-500">
              bâtiment{buildingList.length > 1 ? "s" : ""} référencé
              {buildingList.length > 1 ? "s" : ""}
            </span>
          </Metric>
          <div className="mt-5 flex flex-wrap gap-2">
            {usages.map((usage) => (
              <Badge
                key={String(usage)}
                color="gray"
                className="dark:text-gray-300"
              >
                {usage}
              </Badge>
            ))}
          </div>
          <Text className="mt-auto pt-5">
            Hauteur maximale renseignée{" "}
            <span className="float-right font-medium text-gray-900 dark:text-white">
              {heights.length
                ? `${Math.max(...heights).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} m`
                : "—"}
            </span>
          </Text>
        </SummaryCard>
        <SummaryCard
          title="DPE"
          source="Diagnostics associés à l’adresse BAN"
          icon={<Zap size={18} />}
          {...cardState(dpe)}
          missing={!diagnostics.length}
          empty={
            banId
              ? "Aucun diagnostic disponible pour cette adresse."
              : "L’adresse BAN est nécessaire pour retrouver les diagnostics."
          }
          onOpen={() => onNavigate("dpe")}
        >
          <div className="flex items-center gap-3">
            {dominant.length ? (
              dominant.map((label) => (
                <span
                  key={label}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl font-bold ${getDpeColors(label).bg} ${getDpeColors(label).text}`}
                >
                  {label}
                </span>
              ))
            ) : (
              <Metric>—</Metric>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Classe{dominant.length > 1 ? "s" : ""} la plus fréquente
              </p>
              <Text className="text-xs">
                {diagnostics.length} diagnostic
                {diagnostics.length > 1 ? "s" : ""} à cette adresse
              </Text>
            </div>
          </div>
          <div
            className="mt-5 grid grid-cols-7 gap-1.5"
            aria-label="Répartition des diagnostics par classe énergétique"
          >
            {distribution.map(({ label, count }) => (
              <div key={label} className="text-center">
                <div
                  className={`rounded py-1.5 text-xs font-bold ${getDpeColors(label).bg} ${getDpeColors(label).text}`}
                  title={`Classe ${label} : ${count} diagnostic(s)`}
                >
                  {label}
                </div>
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </div>
            ))}
          </div>
          <Text className="mt-auto pt-4 text-xs">
            Les diagnostics peuvent concerner plusieurs logements et plusieurs
            dates.
          </Text>
        </SummaryCard>
        <SummaryCard
          title="PLU"
          source="Géoportail de l’urbanisme"
          icon={<FileText size={18} />}
          {...cardState(plu)}
          missing={!zones.length}
          empty="Aucun zonage numérique retourné. Le régime applicable reste à vérifier."
          onOpen={() => onNavigate("plu")}
        >
          <div className="flex flex-wrap gap-2">
            {zoneLabels.length ? (
              zoneLabels.map((label) => (
                <Badge
                  key={String(label)}
                  color="emerald"
                  size="lg"
                  className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                >
                  Zone {label}
                </Badge>
              ))
            ) : (
              <Text>Libellé du zonage non renseigné</Text>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {String(
              zones[0]?.properties?.libelong ||
                "Consultez les règles, prescriptions et documents associés à ce zonage.",
            )}
          </p>
          <Text className="mt-auto pt-5 text-xs">
            Le zonage seul ne permet pas de conclure à la constructibilité du
            terrain.
          </Text>
        </SummaryCard>
        <SummaryCard
          title="DVF"
          source="Demandes de valeurs foncières"
          icon={<Landmark size={18} />}
          {...cardState(dvf)}
          missing={!transactions.length}
          empty="Aucune transaction disponible pour cette parcelle."
          onOpen={() => onNavigate("dvf")}
        >
          <Metric className="dark:text-white">
            {format(medianPrice, " €")}
            <span className="ml-1 text-sm font-normal text-gray-500">
              / m² bâti
            </span>
          </Metric>
          <Text className="mt-1 text-xs">
            Médiane indicative sur {ratios.length} enregistrement
            {ratios.length > 1 ? "s" : ""} exploitable(s), hors lignes ambiguës
          </Text>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/5">
            <Text>
              {transactions.length} fiche
              {transactions.length > 1 ? "s" : ""}
            </Text>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {dates.length
                ? `Dernier : ${new Date(dates[dates.length - 1]).toLocaleDateString("fr-FR")}`
                : "Date non renseignée"}
            </span>
          </div>
          <Text className="mt-auto pt-4 text-xs">
            Historique déclaré, sans estimation de la valeur actuelle du bien.
          </Text>
        </SummaryCard>
      </div>
    </div>
  );
}
