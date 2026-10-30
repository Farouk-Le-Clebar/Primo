import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TextInput, Card, Title, Text } from "@tremor/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowLeftRight, ChevronLeft, ChevronRight, ExternalLinkIcon, History, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import L from "leaflet";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import Button from "../../../../ui/Button";
import { ROUTES } from "../../../../constants/routes";
import { deletePlotFromProject, getPlotsOfProject } from "../../../../requests/projects";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import ComparisonDialog from "./ComparisonDialog";
import ComparisonHistory from "./ComparisonHistory";
import ParcelDrawer, { DpeBadge } from "./ParcelDrawer";
import {
    cadastralRef, formatDate, formatPrice, formatSurface, isEnergySieve, matchesQuery, NO_DATA, sortPlots, zoneLabel,
    type SortDirection, type SortKey,
} from "./plotFormat";

const PAGE_SIZE = 12;
const COMPARE_COUNT = 2;

type Filter = "all" | "sieve" | "risks";
const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "sieve", label: "DPE F-G" },
    { key: "risks", label: "Avec risques" },
];

const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-xl border border-gray-100 px-4 py-3 dark:border-white/5">
        <p className="text-xs font-medium text-gray-500 dark:text-[#999999]">{label}</p>
        <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const SortHeader = ({ label, sortKey, active, direction, onSort, align = "left" }: {
    label: string; sortKey: SortKey; active: SortKey; direction: SortDirection; onSort: (key: SortKey) => void; align?: "left" | "center";
}) => {
    const Icon = active !== sortKey ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
    return (
        <TableHeaderCell className={`text-gray-500 dark:text-gray-400 ${align === "center" ? "text-center" : "text-left"}`}>
            <button
                onClick={() => onSort(sortKey)}
                className={`inline-flex cursor-pointer items-center gap-1 hover:text-gray-900 dark:hover:text-white ${active === sortKey ? "text-gray-900 dark:text-white" : ""}`}
            >
                {label}
                <Icon className="w-3 h-3" />
            </button>
        </TableHeaderCell>
    );
};

const ParcelsTab = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [sortKey, setSortKey] = useState<SortKey>("address");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [page, setPage] = useState(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [historyOpen, setHistoryOpen] = useState(false);
    // "new" starts a comparison from the selection, a string reopens a saved one.
    const [comparisonView, setComparisonView] = useState<"new" | string | null>(null);

    const { data: plots, isPending } = useQuery<ProjectPlotWithSummary[]>({
        queryKey: ["projectPlots", projectId],
        queryFn: () => getPlotsOfProject(projectId!),
        refetchOnWindowFocus: false,
    });

    const { mutate: removePlot, isPending: isRemoving } = useMutation({
        mutationFn: (plotId: string) => deletePlotFromProject(plotId),
        onSuccess: (_data, removedId) => {
            queryClient.invalidateQueries({ queryKey: ["projectPlots", projectId] });
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            toast.success("Parcelle supprimée du projet.");
            setSelectedId(null);
            setCompareIds((ids) => ids.filter((id) => id !== removedId));
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            toast.error(err?.response?.data?.message ?? "Impossible de supprimer la parcelle.");
        },
    });

    const filtered = useMemo(() => {
        const matching = (plots ?? []).filter((plot) =>
            matchesQuery(plot, searchQuery)
            && (filter === "all"
                || (filter === "sieve" && isEnergySieve(plot))
                || (filter === "risks" && (plot.summary?.risks?.count ?? 0) > 0)));
        return sortPlots(matching, sortKey, sortDirection);
    }, [plots, searchQuery, filter, sortKey, sortDirection]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount - 1);
    const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
    const selected = plots?.find((plot) => plot.id === selectedId) ?? null;
    const comparePlots = compareIds
        .map((id) => plots?.find((plot) => plot.id === id))
        .filter((plot): plot is ProjectPlotWithSummary => !!plot);
    const canCompare = comparePlots.length === COMPARE_COUNT;

    const toggleCompare = (id: string) =>
        setCompareIds((ids) => (ids.includes(id) ? ids.filter((current) => current !== id) : ids.length < COMPARE_COUNT ? [...ids, id] : ids));

    useEffect(() => setPage(0), [searchQuery, filter, sortKey, sortDirection]);

    const stats = useMemo(() => {
        const all = plots ?? [];
        return {
            total: all.length,
            surface: all.reduce((sum, plot) => sum + (plot.surfaceM2 ?? 0), 0),
            sieves: all.filter(isEnergySieve).length,
            exposed: all.filter((plot) => (plot.summary?.risks?.count ?? 0) > 0).length,
        };
    }, [plots]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDirection("asc"); }
    };

    const showOnMap = (plot: ProjectPlotWithSummary) => {
        const geometry = typeof plot.geometry === "string" ? JSON.parse(plot.geometry) : plot.geometry;
        const center = L.geoJSON(geometry).getBounds().getCenter();
        navigate(ROUTES.map, { state: { centerOn: [center.lat, center.lng] } });
    };

    if (isPending) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-transparent dark:bg-[#0A0A0A]">
                <LoadingPrimoLogo className="h-10 w-10 dark:invert" />
            </div>
        );
    }

    if (!plots || plots.length === 0) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center text-gray-500">
                <p>Aucune parcelle liée à ce projet.</p>
                <Button
                    className="mt-4"
                    width="w-65"
                    height="h-10"
                    backgroundColor="bg-black dark:bg-white"
                    backgroundHoverColor="hover:bg-gray-700 dark:hover:bg-gray-300"
                    textSize="text-base"
                    onClick={() => navigate(ROUTES.map)}
                >
                    <div className="flex flex-row items-center justify-center gap-1 text-white dark:text-black">
                        <p>Ajouter une parcelle</p>
                        <ExternalLinkIcon className="w-4 h-4" />
                    </div>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-transparent p-4 pl-10 pr-10 transition-colors duration-200 dark:bg-[#0A0A0A]">
            <Card className="flex h-80/100 w-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-100 ring-0 transition-colors duration-200 dark:border-white/5 dark:ring-0">
                <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <Title className="text-gray-900 dark:text-white">Parcelles du projet</Title>
                        <Text className="text-gray-500 dark:text-gray-400">
                            Synthèse des données enregistrées pour chaque parcelle. Cliquez sur une ligne pour le détail.
                        </Text>
                    </div>
                    <div className="w-full sm:w-72">
                        <TextInput
                            icon={Search}
                            placeholder="Adresse, référence, zone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
                        />
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Stat label="Parcelles" value={stats.total} />
                    <Stat label="Surface cumulée" value={formatSurface(stats.surface)} />
                    <Stat label="Passoires énergétiques (F-G)" value={stats.sieves} />
                    <Stat label="Communes avec risques" value={stats.exposed} />
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-2">
                    {FILTERS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === key
                                ? "border-transparent bg-[#111111] text-white dark:bg-white dark:text-black"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"}`}
                        >
                            {label}
                        </button>
                    ))}
                    <span className="ml-2 text-xs text-gray-500 dark:text-[#999999]">
                        {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="hidden text-xs text-gray-500 dark:text-[#999999] md:inline">
                            {comparePlots.length === 0
                                ? "Cochez 2 parcelles pour les comparer"
                                : canCompare ? "2 parcelles sélectionnées" : "Sélectionnez une seconde parcelle"}
                        </span>
                        {comparePlots.length > 0 && (
                            <button onClick={() => setCompareIds([])} className="cursor-pointer text-xs text-gray-500 underline hover:text-gray-800 dark:text-[#999999] dark:hover:text-white">
                                Désélectionner
                            </button>
                        )}
                        <button
                            onClick={() => setHistoryOpen(true)}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                        >
                            <History className="w-3.5 h-3.5" />
                            Historique
                        </button>
                        <button
                            onClick={() => setComparisonView("new")}
                            disabled={!canCompare}
                            title={canCompare ? "Comparer les deux parcelles avec l'IA" : "Sélectionnez 2 parcelles pour comparer"}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#111111] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white dark:text-black dark:hover:bg-[#e8e8e8] dark:disabled:bg-white/10 dark:disabled:text-gray-500"
                        >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            Comparer ({comparePlots.length}/{COMPARE_COUNT})
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-custom">
                    <Table>
                        <TableHead>
                            <TableRow className="border-b border-gray-200 dark:border-white/5">
                                <TableHeaderCell className="w-10" />
                                <SortHeader label="Parcelle" sortKey="address" active={sortKey} direction={sortDirection} onSort={handleSort} />
                                <SortHeader label="Surface" sortKey="surface" active={sortKey} direction={sortDirection} onSort={handleSort} align="center" />
                                <TableHeaderCell className="text-center text-gray-500 dark:text-gray-400">Zone PLU</TableHeaderCell>
                                <SortHeader label="Dernière vente" sortKey="lastSale" active={sortKey} direction={sortDirection} onSort={handleSort} align="center" />
                                <SortHeader label="DPE" sortKey="dpe" active={sortKey} direction={sortDirection} onSort={handleSort} align="center" />
                                <SortHeader label="Risques" sortKey="risks" active={sortKey} direction={sortDirection} onSort={handleSort} align="center" />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visible.map((plot) => (
                                <TableRow
                                    key={plot.id}
                                    onClick={() => setSelectedId(plot.id)}
                                    className="cursor-pointer border-b border-gray-100 transition-colors last:border-none hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                                >
                                    <TableCell className="w-10" onClick={(event) => event.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            aria-label={`Comparer ${plot.adress}`}
                                            checked={compareIds.includes(plot.id)}
                                            disabled={!compareIds.includes(plot.id) && compareIds.length >= COMPARE_COUNT}
                                            onChange={() => toggleCompare(plot.id)}
                                            className="h-4 w-4 cursor-pointer accent-[#111111] disabled:cursor-not-allowed disabled:opacity-40 dark:accent-white"
                                        />
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <p className="max-w-[360px] truncate font-medium text-gray-900 dark:text-gray-200" title={plot.adress}>{plot.adress}</p>
                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-[#999999]">{cadastralRef(plot)} · {plot.communeCode ?? plot.plotId.slice(0, 5)}</p>
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600 dark:text-gray-400">{formatSurface(plot.surfaceM2)}</TableCell>
                                    <TableCell className="text-center text-gray-600 dark:text-gray-400">{zoneLabel(plot) ?? NO_DATA}</TableCell>
                                    <TableCell className="text-center text-gray-600 dark:text-gray-400">
                                        {plot.summary?.dvf?.count ? (
                                            <>
                                                <p>{formatPrice(plot.summary.dvf.lastValue)}</p>
                                                <p className="text-xs text-gray-500 dark:text-[#999999]">{formatDate(plot.summary.dvf.lastDate)}</p>
                                            </>
                                        ) : NO_DATA}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {plot.summary?.dpe?.lastLabel ? <DpeBadge label={plot.summary.dpe.lastLabel} /> : <span className="text-gray-400">{NO_DATA}</span>}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-600 dark:text-gray-400">
                                        {plot.summary?.risks ? plot.summary.risks.count : NO_DATA}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filtered.length === 0 && (
                        <div className="py-10 text-center italic text-gray-500 dark:text-gray-400">
                            Aucune parcelle ne correspond à votre recherche.
                        </div>
                    )}
                </div>

                {pageCount > 1 && (
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-white/5 dark:text-[#999999]">
                        <span>Page {currentPage + 1} sur {pageCount}</span>
                        <div className="flex gap-1">
                            <button
                                className="cursor-pointer rounded-md border border-gray-200 p-1.5 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
                                disabled={currentPage === 0}
                                onClick={() => setPage(currentPage - 1)}
                                title="Page précédente"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                className="cursor-pointer rounded-md border border-gray-200 p-1.5 hover:bg-gray-50 disabled:cursor-default disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
                                disabled={currentPage >= pageCount - 1}
                                onClick={() => setPage(currentPage + 1)}
                                title="Page suivante"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {historyOpen && (
                <ComparisonHistory
                    projectId={projectId!}
                    onClose={() => setHistoryOpen(false)}
                    onOpen={(id) => { setHistoryOpen(false); setComparisonView(id); }}
                />
            )}
            {comparisonView && (comparisonView !== "new" || canCompare) && (
                <ComparisonDialog
                    projectId={projectId!}
                    plots={comparisonView === "new" ? [comparePlots[0], comparePlots[1]] : undefined}
                    comparisonId={comparisonView === "new" ? undefined : comparisonView}
                    onClose={() => setComparisonView(null)}
                />
            )}
            {selected && (
                <ParcelDrawer
                    plot={selected}
                    isDeleting={isRemoving}
                    onClose={() => setSelectedId(null)}
                    onShowOnMap={() => showOnMap(selected)}
                    onDelete={() => removePlot(selected.id)}
                />
            )}
        </div>
    );
};

export default ParcelsTab;
