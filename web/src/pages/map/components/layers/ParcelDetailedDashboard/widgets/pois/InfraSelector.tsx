import { memo, useCallback, useState } from "react";
import {
    DEFAULT_EXPANDED_CATEGORIES,
    INFRA_CATEGORIES,
    type InfraCategory,
} from "./constants";

type InfraSelectorProps = {
    selectedTypes: string[];
    loading: boolean;
    isUpToDate: boolean;
    canCalculate: boolean;
    error: string | null;
    onToggleType: (code: string) => void;
    onSetTypes: (codes: string[], selected: boolean) => void;
    onReset: () => void;
    onClear: () => void;
    onCalculate: () => void;
};

type CategorySectionProps = {
    category: InfraCategory;
    selectedTypes: string[];
    isExpanded: boolean;
    onToggleExpanded: (label: string) => void;
    onToggleType: (code: string) => void;
    onSetTypes: (codes: string[], selected: boolean) => void;
};

function CategorySection({
    category,
    selectedTypes,
    isExpanded,
    onToggleExpanded,
    onToggleType,
    onSetTypes,
}: CategorySectionProps) {
    const codes = category.types.map((type) => type.code);
    const selectedInCategory = codes.filter((code) =>
        selectedTypes.includes(code),
    ).length;
    const allSelected = codes.length > 0 && selectedInCategory === codes.length;

    return (
        <section className="py-4">
            <div className="flex items-center gap-3">
                <input
                    aria-label={`Sélectionner toute la catégorie ${category.label}`}
                    type="checkbox"
                    checked={allSelected}
                    ref={(element) => {
                        if (element) {
                            element.indeterminate =
                                selectedInCategory > 0 && !allSelected;
                        }
                    }}
                    onChange={() => onSetTypes(codes, !allSelected)}
                    className="h-3.5 w-3.5 accent-emerald-600"
                />
                <button
                    type="button"
                    onClick={() => onToggleExpanded(category.label)}
                    className="flex flex-1 items-center justify-between py-1 text-left text-sm text-slate-600"
                >
                    <span>{category.label}</span>
                    <span className="text-slate-500">
                        {isExpanded ? "⌄" : "›"}
                    </span>
                </button>
            </div>
            {isExpanded && (
                <div className="ml-5 mt-1.5 space-y-2 pb-1">
                    {category.types.map((type) => (
                        <label
                            key={type.code}
                            className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type.code)}
                                onChange={() => onToggleType(type.code)}
                                className="h-3.5 w-3.5 accent-emerald-600"
                            />
                            {type.label}
                        </label>
                    ))}
                </div>
            )}
        </section>
    );
}

function InfraSelector({
    selectedTypes,
    loading,
    isUpToDate,
    canCalculate,
    error,
    onToggleType,
    onSetTypes,
    onReset,
    onClear,
    onCalculate,
}: InfraSelectorProps) {
    const [expanded, setExpanded] = useState<string[]>(
        DEFAULT_EXPANDED_CATEGORIES,
    );
    const selectedCount = selectedTypes.length;

    const toggleExpanded = useCallback((label: string) => {
        setExpanded((current) =>
            current.includes(label)
                ? current.filter((item) => item !== label)
                : [...current, label],
        );
    }, []);

    return (
        <aside className="w-full shrink-0 self-start rounded-xl bg-white p-5 md:sticky md:top-0 md:max-h-[calc(100vh-2rem)] md:w-80 md:overflow-y-auto lg:w-96">
            <div className="mb-8 flex items-center justify-between text-xs">
                
                <button
                    type="button"
                    onClick={onClear}
                    disabled={selectedCount === 0}
                    className="text-slate-500  hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                >
                    Tout désélectionner
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="text-slate-500  hover:text-slate-900 "
                >
                    Réinitialiser
                </button>
            </div>

            <div className="divide-y divide-slate-100 border-y border-slate-500">
                {INFRA_CATEGORIES.map((category) => (
                    <CategorySection
                        key={category.label}
                        category={category}
                        selectedTypes={selectedTypes}
                        isExpanded={expanded.includes(category.label)}
                        onToggleExpanded={toggleExpanded}
                        onToggleType={onToggleType}
                        onSetTypes={onSetTypes}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={onCalculate}
                disabled={loading || !canCalculate || selectedCount === 0}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading
                    ? "Calcul en cours…"
                    : isUpToDate
                      ? "Recalculer la proximité"
                      : "Calculer la proximité"}
            </button>
            <p className="mt-2 flex items-start gap-1 text-[11px] leading-snug text-slate-500">
                <span aria-hidden="true" className="shrink-0 text-sm leading-none">
                    ⓘ
                </span>
                <span>
                    Les distances sont calculées à vol d'oiseau : elles ne
                    reflètent pas la distance réelle à parcourir.
                    <span className="mt-1 block">
                        L'indice de proximité est calculé par rapport à une distance maximale de 30km. Au-delà, l'indice est de 0%.
                    </span>
                </span>
            </p>
            
            {error && (
                <p role="alert" className="mt-3 break-words text-xs text-red-700">
                    {error}
                </p>
            )}
        </aside>
    );
}

export default memo(InfraSelector);