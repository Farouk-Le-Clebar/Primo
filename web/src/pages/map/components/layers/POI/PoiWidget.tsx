import { useEffect, useMemo, useRef, useState } from "react";
import { FAMILLE_LABELS, POI_CONFIGS, type PoiFamille } from "../../PoiConfig";
import { ChevronRight, Check, Plus } from "lucide-react";

interface PoiWidgetProps {
    enabledPoiTypes: string[];
    onTogglePoi: (type: string, enabled: boolean) => void;
    currentZoom: number;
    minZoomForPois: number;
}

/**
 * ---------------------------------------------------------------------------
 * Catégories générées dynamiquement depuis POI_CONFIGS.
 * ---------------------------------------------------------------------------

 * Ajouter un nouveau type d'infrastructure dans PoiConfig.ts (avec sa
 * famille) l'ajoute donc automatiquement ici, sans toucher à ce fichier.
 * ---------------------------------------------------------------------------
 */
type PoiLeaf = { key: string; label: string };
type PoiCategory =
    | { key: PoiFamille; label: string; type: "group"; children: PoiLeaf[] }
    | { key: string; label: string; type: "single" };

function buildCategoriesFromConfig(): PoiCategory[] {
    const byFamille = new Map<PoiFamille, PoiLeaf[]>();

    for (const config of Object.values(POI_CONFIGS)) {
        const list = byFamille.get(config.famille) ?? [];
        list.push({ key: config.type, label: config.label });
        byFamille.set(config.famille, list);
    }

    const categories: PoiCategory[] = [];
    for (const [famille, children] of byFamille.entries()) {
        const sortedChildren = [...children].sort((a, b) =>
            a.label.localeCompare(b.label, "fr"),
        );
        if (sortedChildren.length === 1) {
            categories.push({
                key: sortedChildren[0].key,
                label: sortedChildren[0].label,
                type: "single",
            });
        } else {
            categories.push({
                key: famille,
                label: FAMILLE_LABELS[famille] ?? famille,
                type: "group",
                children: sortedChildren,
            });
        }
    }

    // Ordre: familles avec le plus de types d'abord.
    categories.sort((a, b) => {
        const aCount = a.type === "group" ? a.children.length : 1;
        const bCount = b.type === "group" ? b.children.length : 1;
        return bCount - aCount;
    });

    return categories;
}

// Hauteur fixe de la card
const LIST_HEIGHT = "h-[240px]";

// Rayon du rectangle "Ajoutez vos adresses"
const FOOTER_RADIUS = "rounded-xl";

// Séparateur fin entre chaque élément principal (catégories / choix uniques uniquement).
const ROW_DIVIDER =
    "relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:border-b after:border-gray-100 dark:after:border-white/10";


const ROW_PADDING = "py-3.5";
const CHILD_PADDING = "py-3";

const Checkbox = ({ checked }: { checked: boolean }) => (
    <div
        className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
            checked
                ? "bg-emerald-600 border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                : "border-gray-300 bg-white dark:border-white/20 dark:bg-transparent"
        }`}
    >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
    </div>
);

const PoiWidget = ({
    enabledPoiTypes,
    onTogglePoi,
    currentZoom,
    minZoomForPois,
}: PoiWidgetProps) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const listRef = useRef<HTMLDivElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    const categories = useMemo(() => buildCategoriesFromConfig(), []);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        setIsScrollable(el.scrollHeight > el.clientHeight + 1);
    }, [expanded]);

    const isChecked = (type: string) => enabledPoiTypes.includes(type);

    const handleToggle = (type: string) => {
        const isCurrentlyEnabled = enabledPoiTypes.includes(type);
        onTogglePoi(type, !isCurrentlyEnabled);
    };

    const toggleExpand = (key: string) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    //Pour les groupes: selectionne/désélectionne tous les enfants
    const handleToggleGroup = (children: PoiLeaf[]) => {
        const allChecked = children.every((child) => isChecked(child.key));
        children.forEach((child) => {
            const currentlyEnabled = isChecked(child.key);
            if (allChecked ? currentlyEnabled : !currentlyEnabled) {
                onTogglePoi(child.key, !allChecked);
            }
        });
    };

    return (
        <div className="bg-white dark:bg-[#0A0A0A] font-inter rounded-[20px] shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden w-64 transition-colors duration-200 flex flex-col">
            {/* Header */}
            <div className="px-4 py-4 bg-white dark:bg-[#111111] transition-colors duration-200 flex-shrink-0">
                <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs tracking-wide">
                    VOS POINTS D'INTÉRÊTS
                </span>
                {currentZoom < minZoomForPois && (
                    <p className="text-[10px] text-gray-500 dark:text-[#999999] mt-1">
                        Zoomez pour afficher les résultats
                    </p>
                )}
            </div>

            {/* Liste */}
            <div
                ref={listRef}
                className={`${LIST_HEIGHT} overflow-y-auto custom-scrollbar`}
            >
                {categories.map((category) => {
                    if (category.type === "single") {
                        const checked = isChecked(category.key);
                        return (
                            <button
                                key={category.key}
                                onClick={() => handleToggle(category.key)}
                                className={`w-full px-4 ${ROW_PADDING} flex items-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${ROW_DIVIDER}`}
                            >
                                <Checkbox checked={checked} />
                                <span
                                    className={`text-sm flex-1 text-left transition-colors ${
                                        checked
                                            ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {category.label}
                                </span>
                            </button>
                        );
                    }

                    const isOpen = !!expanded[category.key];
                    const hasChildren = category.children.length > 0;
                    const allChecked =
                        hasChildren &&
                        category.children.every((child) =>
                            isChecked(child.key),
                        );

                    return (
                        <div key={category.key}>
                            <button
                                onClick={() => toggleExpand(category.key)}
                                className={`w-full px-4 ${ROW_PADDING} flex items-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${ROW_DIVIDER}`}
                            >
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (hasChildren)
                                            handleToggleGroup(
                                                category.children,
                                            );
                                    }}
                                >
                                    <Checkbox checked={allChecked} />
                                </span>
                                <span className="text-sm flex-1 text-left text-gray-700 dark:text-gray-300">
                                    {category.label}
                                </span>
                                {hasChildren && (
                                    <ChevronRight
                                        size={16}
                                        strokeWidth={2}
                                        className={`text-gray-400 dark:text-gray-500 transition-transform duration-150 ${
                                            isOpen ? "rotate-90" : ""
                                        }`}
                                    />
                                )}
                            </button>

                            {isOpen &&
                                category.children.map((child) => {
                                    const checked = isChecked(child.key);
                                    return (
                                        <button
                                            key={child.key}
                                            onClick={() =>
                                                handleToggle(child.key)
                                            }
                                            className={`w-full pl-9 pr-4 ${CHILD_PADDING} flex items-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer`}
                                        >
                                            <Checkbox checked={checked} />
                                            <span
                                                className={`text-sm flex-1 text-left transition-colors ${
                                                    checked
                                                        ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                                        : "text-gray-500 dark:text-gray-400"
                                                }`}
                                            >
                                                {child.label}
                                            </span>
                                        </button>
                                    );
                                })}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="relative flex-shrink-0">
                {isScrollable && (
                    <div className="pointer-events-none absolute -top-4 inset-x-0 h-4 bg-gradient-to-b from-transparent to-white dark:to-[#0A0A0A]" />
                )}
                <div className="p-2 bg-white dark:bg-[#0A0A0A]">
                    <button
                        className={`w-full px-4 py-2.5 flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer ${FOOTER_RADIUS}`}
                    >
                        <Plus
                            size={14}
                            className="text-gray-500 dark:text-gray-400"
                            strokeWidth={2}
                        />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            Ajoutez vos adresses
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PoiWidget;
