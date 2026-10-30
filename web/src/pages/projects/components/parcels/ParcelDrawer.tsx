import { useEffect, useState, type ReactNode } from "react";
import { Building2, Check, CloudSun, Euro, FileStack, Flame, Landmark, MapPin, Navigation, ShieldAlert, Trash2, X, type LucideIcon } from "lucide-react";
import PlotMap from "./PlotMap";
import { getDpeColors } from "../../../map/components/layers/ParcelDetailedDashboard/widgets/dpe/utils";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { cadastralRef, formatDate, formatDistance, formatPrice, formatSurface, isEnriched, NO_DATA } from "./plotFormat";

type ParcelDrawerProps = {
    plot: ProjectPlotWithSummary;
    isDeleting: boolean;
    onClose: () => void;
    onShowOnMap: () => void;
    onDelete: () => void;
};

const Section = ({ icon: Icon, title, children, empty }: { icon: LucideIcon; title: string; children?: ReactNode; empty?: boolean }) => (
    <section className="rounded-xl border border-gray-100 dark:border-white/5 p-4">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#999999]">
            <Icon className="w-3.5 h-3.5" />
            {title}
        </h3>
        {empty ? (
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">Aucune donnée pour cette parcelle.</p>
        ) : (
            <div className="mt-3 text-sm text-gray-800 dark:text-gray-200">{children}</div>
        )}
    </section>
);

const Fact = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex items-baseline justify-between gap-4 py-1">
        <dt className="text-gray-500 dark:text-[#999999]">{label}</dt>
        <dd className="font-medium text-right">{value}</dd>
    </div>
);

const Chip = ({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "amber" }) => (
    <span className={`rounded-md px-2 py-1 text-xs font-medium ${tone === "amber"
        ? "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
        : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300"}`}
    >
        {children}
    </span>
);

export const DpeBadge = ({ label }: { label: string | null | undefined }) => {
    const colors = getDpeColors(label ?? undefined);
    return (
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${colors.bg} ${colors.text}`}>
            {label ?? "?"}
        </span>
    );
};

const ParcelDrawer = ({ plot, isDeleting, onClose, onShowOnMap, onDelete }: ParcelDrawerProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const { summary } = plot;

    useEffect(() => setConfirmDelete(false), [plot.id]);
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <>
            <div className="fixed inset-x-0 bottom-0 top-14 z-30 bg-black/20 dark:bg-black/40" onClick={onClose} />
            <aside className="fixed bottom-0 right-0 top-14 z-30 flex w-full max-w-[460px] flex-col border-l border-gray-100 bg-white text-gray-800 shadow-xl dark:border-white/10 dark:bg-[#171717] dark:text-gray-200">
                <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 dark:border-white/5">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-[#999999]">Parcelle {cadastralRef(plot)}</p>
                        <h2 className="mt-0.5 text-base font-semibold text-gray-900 dark:text-white line-clamp-2">{plot.adress}</h2>
                        <p className="mt-1 text-xs text-gray-500 dark:text-[#999999]">
                            {plot.plotId} · {formatSurface(plot.surfaceM2)}
                        </p>
                    </div>
                    <button onClick={onClose} className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-white" title="Fermer">
                        <X className="w-4 h-4" />
                    </button>
                </header>

                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-custom">
                    <div className="h-44 overflow-hidden rounded-xl border border-gray-100 dark:border-white/5">
                        <PlotMap plot={plot} />
                    </div>

                    {!isEnriched(plot) && (
                        <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400">
                            Cette parcelle a été ajoutée avant l'enregistrement des données : seules les informations de base sont disponibles.
                        </p>
                    )}
                    {plot.enrichmentErrors && (
                        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                            Certaines sources n'ont pas répondu à l'ajout : {Object.keys(plot.enrichmentErrors).join(", ")}.
                        </p>
                    )}

                    <Section icon={Euro} title="Marché (DVF)" empty={!summary.dvf || summary.dvf.count === 0}>
                        <dl>
                            <Fact label="Transactions" value={summary.dvf?.count} />
                            <Fact label="Dernière vente" value={formatDate(summary.dvf?.lastDate)} />
                            <Fact label="Valeur foncière" value={formatPrice(summary.dvf?.lastValue)} />
                            <Fact label="Nature" value={summary.dvf?.lastLocalType ?? summary.dvf?.lastNature ?? NO_DATA} />
                        </dl>
                    </Section>

                    <Section icon={Flame} title="Performance énergétique (DPE)" empty={!summary.dpe || summary.dpe.count === 0}>
                        <div className="flex items-center gap-3">
                            <DpeBadge label={summary.dpe?.lastLabel} />
                            <span className="text-xs text-gray-500 dark:text-[#999999]">GES</span>
                            <DpeBadge label={summary.dpe?.lastGes} />
                            <span className="ml-auto text-xs text-gray-500 dark:text-[#999999]">{summary.dpe?.count} diagnostic{(summary.dpe?.count ?? 0) > 1 ? "s" : ""}</span>
                        </div>
                        <dl className="mt-2">
                            <Fact label="Établi le" value={formatDate(summary.dpe?.lastDate)} />
                            <Fact label="Surface habitable" value={summary.dpe?.lastSurface ? `${summary.dpe.lastSurface} m²` : NO_DATA} />
                            <Fact label="Année de construction" value={summary.dpe?.constructionYear ?? NO_DATA} />
                        </dl>
                    </Section>

                    <Section icon={Landmark} title="Urbanisme (PLU)" empty={!summary.plu || summary.plu.zones.length === 0}>
                        <div className="flex flex-wrap gap-1.5">
                            {summary.plu?.zones.map((zone) => <Chip key={zone}>{zone}</Chip>)}
                        </div>
                        {summary.plu?.description && <p className="mt-2 text-xs text-gray-500 dark:text-[#999999]">{summary.plu.description}</p>}
                        <dl className="mt-2">
                            <Fact label="Prescriptions" value={summary.plu?.prescriptions} />
                            <Fact label="Informations" value={summary.plu?.informations} />
                        </dl>
                    </Section>

                    <Section icon={FileStack} title="Autorisations d'urbanisme" empty={!summary.permits || summary.permits.count === 0}>
                        <dl>
                            <Fact label="Dossiers" value={summary.permits?.count} />
                            <Fact label="Dernier dossier" value={formatDate(summary.permits?.lastDate)} />
                            <Fact label="Type" value={summary.permits?.lastType ?? NO_DATA} />
                        </dl>
                    </Section>

                    <Section icon={ShieldAlert} title="Risques" empty={!summary.risks}>
                        <div className="flex flex-wrap gap-1.5">
                            {summary.risks?.names.slice(0, 8).map((risk) => <Chip key={risk} tone="amber">{risk}</Chip>)}
                            {(summary.risks?.names.length ?? 0) > 8 && <Chip>+{summary.risks!.names.length - 8}</Chip>}
                            {summary.risks?.count === 0 && <span className="text-gray-500">Aucun risque recensé dans la commune.</span>}
                        </div>
                        <dl className="mt-2">
                            <Fact label="Sismicité" value={summary.risks?.seismicZone ?? NO_DATA} />
                            <Fact label="Radon" value={summary.risks?.radon ?? NO_DATA} />
                            <Fact label="Arrêtés CatNat" value={summary.risks?.catnatCount} />
                        </dl>
                    </Section>

                    <Section icon={Building2} title="Bâtiments" empty={!summary.buildings}>
                        <dl><Fact label="Bâtiments sur la parcelle" value={summary.buildings?.count} /></dl>
                    </Section>

                    <Section icon={CloudSun} title="Climat" empty={!summary.climate}>
                        <dl>
                            <Fact label="Température moyenne" value={summary.climate?.meanTemperature != null ? `${summary.climate.meanTemperature} °C` : NO_DATA} />
                            <Fact label="Max. d'été" value={summary.climate?.summerMaxTemperature != null ? `${summary.climate.summerMaxTemperature} °C` : NO_DATA} />
                            <Fact label="Min. d'hiver" value={summary.climate?.winterMinTemperature != null ? `${summary.climate.winterMinTemperature} °C` : NO_DATA} />
                            <Fact label="Précipitations annuelles" value={summary.climate?.annualPrecipitation != null ? `${summary.climate.annualPrecipitation} mm` : NO_DATA} />
                        </dl>
                    </Section>

                    <Section icon={MapPin} title="Proximité" empty={!summary.proximity}>
                        <dl>
                            <Fact label="Score moyen" value={summary.proximity?.averageScore != null ? `${summary.proximity.averageScore}/100` : NO_DATA} />
                            <Fact label="Équipements trouvés" value={`${summary.proximity?.found}/${summary.proximity?.requested}`} />
                        </dl>
                        <ul className="mt-2 space-y-1">
                            {summary.proximity?.nearest.map((item) => (
                                <li key={`${item.label}-${item.distanceM}`} className="flex justify-between gap-4 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="truncate">{item.name ?? item.label}</span>
                                    <span className="shrink-0">{formatDistance(item.distanceM)}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>

                <footer className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/5">
                    <button
                        onClick={onShowOnMap}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#111111] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-[#e8e8e8]"
                    >
                        <Navigation className="w-3.5 h-3.5" />
                        Voir sur la carte
                    </button>
                    {confirmDelete ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Supprimer ?</span>
                            <button className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-gray-400 transition-colors hover:bg-gray-300 hover:text-white dark:hover:bg-gray-600"
                                onClick={() => setConfirmDelete(false)} title="Annuler">
                                <X className="w-4 h-4" />
                            </button>
                            <button className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                disabled={isDeleting} onClick={onDelete} title="Confirmer la suppression">
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                            onClick={() => setConfirmDelete(true)}>
                            <Trash2 className="w-3.5 h-3.5" />
                            Retirer du projet
                        </button>
                    )}
                </footer>
            </aside>
        </>
    );
};

export default ParcelDrawer;
