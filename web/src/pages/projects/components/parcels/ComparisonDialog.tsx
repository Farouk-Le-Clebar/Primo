import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeftRight, Check, Clock, Loader2, Sparkles, Trophy, X } from "lucide-react";
import toast from "react-hot-toast";
import { createPlotComparison, getPlotComparison } from "../../../../requests/projects";
import type { PlotComparison, PlotSide } from "../../../../types/project/comparisons";
import type { ProjectPlotWithSummary } from "../../../../types/project/plots";
import { DpeBadge } from "./ParcelDrawer";
import { cadastralRef, formatDate, formatPrice, formatSurface, NO_DATA, zoneLabel } from "./plotFormat";

const POLL_INTERVAL_MS = 3000;
const BRIEF_MAX_LENGTH = 1000;
const BRIEF_EXAMPLES = [
    "Je cherche un terrain à construire pour de l'habitat",
    "Investissement locatif, budget serré",
    "Je privilégie la sécurité et le faible risque",
];

const CONFIDENCE_LABELS = { faible: "Confiance faible", moyenne: "Confiance moyenne", elevee: "Confiance élevée" } as const;
const WEIGHT_STYLES = {
    majeur: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
    important: "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
    secondaire: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
} as const;

type ComparisonDialogProps = {
    projectId: string;
    // Plots to compare (new comparison), or none when only reopening a saved one.
    plots?: [ProjectPlotWithSummary, ProjectPlotWithSummary];
    comparisonId?: string;
    onClose: () => void;
};

const SideBadge = ({ side }: { side: PlotSide }) => (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#111111] text-[11px] font-bold text-white dark:bg-white dark:text-black">
        {side}
    </span>
);

const Block = ({ title, children }: { title: string; children: ReactNode }) => (
    <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-[#999999]">{title}</h3>
        <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">{children}</div>
    </section>
);

const BulletList = ({ items, tone }: { items: string[]; tone?: "good" | "bad" }) => (
    <ul className="space-y-1.5">
        {items.map((item) => (
            <li key={item} className="flex gap-2">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "good" ? "bg-emerald-500" : tone === "bad" ? "bg-red-500" : "bg-gray-400"}`} />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const PlotPreview = ({ side, plot }: { side: PlotSide; plot: ProjectPlotWithSummary }) => (
    <div className="min-w-0 flex-1 rounded-xl border border-gray-100 p-3 dark:border-white/5">
        <div className="flex items-center gap-2">
            <SideBadge side={side} />
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white" title={plot.adress}>{plot.adress}</p>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-[#999999]">{cadastralRef(plot)} · {formatSurface(plot.surfaceM2)}</p>
        <dl className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between gap-2"><dt>Zone PLU</dt><dd className="font-medium">{zoneLabel(plot) ?? NO_DATA}</dd></div>
            <div className="flex justify-between gap-2">
                <dt>Dernière vente</dt>
                <dd className="font-medium">{plot.summary?.dvf?.count ? `${formatPrice(plot.summary.dvf.lastValue)} · ${formatDate(plot.summary.dvf.lastDate)}` : NO_DATA}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
                <dt>DPE</dt>
                <dd>{plot.summary?.dpe?.lastLabel ? <DpeBadge label={plot.summary.dpe.lastLabel} /> : NO_DATA}</dd>
            </div>
            <div className="flex justify-between gap-2"><dt>Risques communaux</dt><dd className="font-medium">{plot.summary?.risks ? plot.summary.risks.count : NO_DATA}</dd></div>
        </dl>
    </div>
);

const ComparisonResultView = ({ comparison }: { comparison: PlotComparison }) => {
    const { result } = comparison;
    const labelOf = (side: PlotSide) => (side === "A" ? comparison.plotALabel : comparison.plotBLabel);

    if (comparison.status === "pending") {
        return (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Analyse en attente</p>
                <p className="max-w-sm text-xs text-gray-500 dark:text-[#999999]">
                    La comparaison est enregistrée. Le résultat s'affichera ici dès que l'analyse IA sera terminée, vous pouvez fermer cette fenêtre et la retrouver dans l'historique.
                </p>
            </div>
        );
    }

    if (comparison.status === "failed" || !result) {
        return (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">L'analyse a échoué</p>
                <p className="max-w-sm text-xs text-gray-500 dark:text-[#999999]">{comparison.errorMessage ?? "Une erreur est survenue. Relancez la comparaison."}</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <Trophy className="h-4 w-4" />
                    Parcelle recommandée
                    <span className="ml-auto rounded-md bg-white/70 px-2 py-0.5 dark:bg-white/10">{CONFIDENCE_LABELS[result.confidence]}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <SideBadge side={result.winner} />
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{labelOf(result.winner)}</p>
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{result.headline}</p>
            </div>

            <Block title="Synthèse"><p className="leading-relaxed">{result.summary}</p></Block>

            <Block title="Critères comparés">
                <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 dark:divide-white/5 dark:border-white/5">
                    {result.criteria.map((criterion) => (
                        <li key={criterion.key} className="p-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{criterion.label}</span>
                                <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${WEIGHT_STYLES[criterion.weight] ?? WEIGHT_STYLES.secondaire}`}>{criterion.weight}</span>
                                <span className="ml-auto flex items-center gap-1 text-xs text-gray-500 dark:text-[#999999]">
                                    {criterion.winner === "A" || criterion.winner === "B" ? <><SideBadge side={criterion.winner} /> l'emporte</> : criterion.winner === "egalite" ? "Égalité" : "Indéterminé"}
                                </span>
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{criterion.analysis}</p>
                        </li>
                    ))}
                </ul>
            </Block>

            <div className="grid gap-4 sm:grid-cols-2">
                {(["A", "B"] as const).map((side) => (
                    <div key={side} className="rounded-xl border border-gray-100 p-3 dark:border-white/5">
                        <div className="mb-2 flex items-center gap-2"><SideBadge side={side} /><span className="truncate text-xs font-medium">{labelOf(side)}</span></div>
                        <div className="space-y-3 text-xs">
                            <BulletList items={result.plots[side].strengths} tone="good" />
                            <BulletList items={result.plots[side].weaknesses} tone="bad" />
                        </div>
                    </div>
                ))}
            </div>

            {result.caveats.length > 0 && <Block title="Limites de l'analyse"><BulletList items={result.caveats} /></Block>}
            {result.nextSteps.length > 0 && <Block title="À vérifier avant de décider"><BulletList items={result.nextSteps} /></Block>}
        </div>
    );
};

const ComparisonDialog = ({ projectId, plots, comparisonId: initialComparisonId, onClose }: ComparisonDialogProps) => {
    const queryClient = useQueryClient();
    const [comparisonId, setComparisonId] = useState<string | undefined>(initialComparisonId);
    const [question, setQuestion] = useState("");

    const { mutate: startComparison, isPending: isStarting } = useMutation({
        mutationFn: () => createPlotComparison(projectId, { plotAId: plots![0].id, plotBId: plots![1].id, question: question.trim() || undefined }),
        onSuccess: (comparison) => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId, "comparisons"] });
            setComparisonId(comparison.id);
        },
        onError: (err: { message?: string }) => toast.error(err?.message ?? "Impossible de lancer la comparaison."),
    });

    const { data: comparison } = useQuery({
        queryKey: ["project", projectId, "comparisons", comparisonId],
        queryFn: () => getPlotComparison(projectId, comparisonId!),
        enabled: !!comparisonId,
        refetchInterval: (query) => (query.state.data?.status === "pending" ? POLL_INTERVAL_MS : false),
    });

    return (
        <div className="fixed inset-x-0 bottom-0 top-14 z-30 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/80" onClick={onClose}>
            <div
                className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white text-gray-800 shadow-xl dark:border-white/10 dark:bg-[#171717] dark:text-gray-200"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Comparaison de parcelles</h2>
                    </div>
                    <button onClick={onClose} className="cursor-pointer rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-white" title="Fermer">
                        <X className="h-4 w-4" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-custom">
                    {!comparisonId && plots ? (
                        <div className="space-y-5">
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <PlotPreview side="A" plot={plots[0]} />
                                <PlotPreview side="B" plot={plots[1]} />
                            </div>

                            <Block title="Votre besoin (optionnel)">
                                <textarea
                                    value={question}
                                    onChange={(event) => setQuestion(event.target.value.slice(0, BRIEF_MAX_LENGTH))}
                                    rows={3}
                                    placeholder="Décrivez votre projet, votre budget, vos priorités..."
                                    className="w-full resize-none rounded-lg border border-gray-200 bg-transparent p-3 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-white/10 dark:text-white dark:focus:border-white/30"
                                />
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {BRIEF_EXAMPLES.map((example) => (
                                        <button key={example} onClick={() => setQuestion(example)}
                                            className="cursor-pointer rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5">
                                            {example}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-right text-[11px] text-gray-400">{question.length}/{BRIEF_MAX_LENGTH}</p>
                            </Block>

                            <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400">
                                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                L'IA compare toutes les données enregistrées (marché, urbanisme, risques, énergie, proximité...) et tranche en faveur d'une des deux parcelles.
                            </p>
                        </div>
                    ) : comparison ? (
                        <div className="space-y-4">
                            {comparison.question && (
                                <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs italic text-gray-500 dark:bg-white/5 dark:text-gray-400">« {comparison.question} »</p>
                            )}
                            <ComparisonResultView comparison={comparison} />
                        </div>
                    ) : (
                        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
                    )}
                </div>

                {!comparisonId && plots && (
                    <footer className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/5">
                        <button onClick={onClose} className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                            Annuler
                        </button>
                        <button
                            onClick={() => startComparison()}
                            disabled={isStarting}
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#111111] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-default disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-[#e8e8e8]"
                        >
                            {isStarting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            Lancer la comparaison
                        </button>
                    </footer>
                )}
                {comparison?.status === "pending" && (
                    <footer className="flex items-center gap-2 border-t border-gray-100 px-5 py-3 text-xs text-gray-500 dark:border-white/5 dark:text-[#999999]">
                        <Clock className="h-3.5 w-3.5" /> Créée le {formatDate(comparison.createdAt)}
                    </footer>
                )}
            </div>
        </div>
    );
};

export default ComparisonDialog;
