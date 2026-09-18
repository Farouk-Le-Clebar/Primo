// import { POI_CONFIGS } from "../../PoiConfig";
// import { MapPin } from "lucide-react";

// interface PoiWidgetProps {
//     enabledPoiTypes: string[];
//     onTogglePoi: (type: string, enabled: boolean) => void;
//     currentZoom: number;
//     minZoomForPois: number;
// }

// const PoiWidget = ({ enabledPoiTypes, onTogglePoi, currentZoom, minZoomForPois }: PoiWidgetProps) => {

//     const handleToggle = (type: string) => {
//         const isCurrentlyEnabled = enabledPoiTypes.includes(type);
//         onTogglePoi(type, !isCurrentlyEnabled);
//     };

//     return (
//         <div className="bg-white dark:bg-[#0A0A0A] font-inter rounded-xl shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden w-64 transition-colors duration-200">
            
//             <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#111111] transition-colors duration-200">
//                 <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
//                     Points d'intérêts
//                 </span>
//                 {currentZoom < minZoomForPois && (
//                     <p className="text-[10px] text-gray-500 dark:text-[#999999] mt-1">Zoomez pour afficher les résultats</p>
//                 )}
//             </div>

//             <div className="py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
//                 {Object.entries(POI_CONFIGS).map(([key, config]) => {
//                     const IconComponent = config.ticon;
//                     const isActive = enabledPoiTypes.includes(key);
//                     return (
//                         <button
//                             key={key}
//                             onClick={() => handleToggle(key)}
//                             className="w-full px-4 py-2.5 flex items-center gap-3 transition-all relative hover:bg-gray-50 dark:hover:bg-white/5 group cursor-pointer"
//                         >
//                             {isActive && (
//                                 <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 dark:bg-blue-400 rounded-full" />
//                             )}
                            
//                             <div className={`flex-shrink-0 transition-all ${isActive ? "ml-2" : ""}`}>
//                                 <IconComponent
//                                     size={18}
//                                     className={`transition-colors ${
//                                         isActive ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
//                                     }`}
//                                     strokeWidth={2}
//                                 />
//                             </div>
                            
//                             <span
//                                 className={`text-sm flex-1 text-left transition-all ${
//                                     isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"
//                                 }`}
//                             >
//                                 {config.label}
//                             </span>
//                         </button>
//                     );
//                 })}
//             </div>
            
//             <div className="border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#111111] transition-colors duration-200">
//                 <button className="w-full px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
//                     <MapPin size={14} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
//                     <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
//                         Ajouter une adresse personnalisée
//                     </span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PoiWidget;

import { useEffect, useRef, useState } from "react";
import { POI_CONFIGS } from "../../PoiConfig";
import { ChevronRight, Check, Plus } from "lucide-react";

interface PoiWidgetProps {
  enabledPoiTypes: string[];
  onTogglePoi: (type: string, enabled: boolean) => void;
  currentZoom: number;
  minZoomForPois: number;
}

/**
 * ---------------------------------------------------------------------------
 * DONNÉES BRUTES / PLACEHOLDER
 * ---------------------------------------------------------------------------
 * Tant que le back-end / POI_CONFIGS ne fournit pas toutes les catégories,
 * on définit ici la structure de menu (catégories + sous-catégories) avec
 * des libellés en dur. Pour chaque item, si une entrée correspondante existe
 * dans POI_CONFIGS (même "key"), son label réel prendra le dessus.
 *
 * -> Quand les vraies données seront disponibles, il suffira de remplacer
 *    ce tableau par une génération dynamique à partir de POI_CONFIGS
 *    (ou de le supprimer si POI_CONFIGS expose déjà cette hiérarchie).
 * ---------------------------------------------------------------------------
 */
type PoiLeaf = { key: string; label: string };
type PoiCategory =
  | { key: string; label: string; type: "group"; children: PoiLeaf[] }
  | { key: string; label: string; type: "single" };

const POI_CATEGORIES: PoiCategory[] = [
  {
    key: "sports",
    label: "Sports",
    type: "group",
    children: [
      { key: "piscine_publique", label: "Piscine publique" },
      { key: "salle_de_sport", label: "Salle de sport" },
      { key: "terrain_tennis", label: "Terrain de tennis" },
      { key: "golf", label: "Golf" },
    ],
  },
  {
    key: "culture",
    label: "Culture",
    type: "group",
    children: [
      { key: "library", label: "Librairie" }, // déjà implémenté côté back, doit être fonctionnel
      { key: "cinema", label: "Cinéma" }, // TODO : n'existe pas encore, donnée brute
      { key: "musee", label: "Musée" }, // TODO : n'existe pas encore, donnée brute
    ],
  },
  {
    key: "sante",
    label: "Santé",
    type: "group",
    children: [
      { key: "pharmacie", label: "Pharmacie" }, // déjà implémenté côté back, doit être fonctionnel
      { key: "hopital", label: "Hôpital" }, // déjà implémenté côté back, doit être fonctionnel
    ],
  },
  { key: "commerces", label: "Commerces", type: "single" },
  { key: "parcs", label: "Parcs", type: "single" },
];

const getLabel = (key: string, fallback: string) =>
  (POI_CONFIGS as Record<string, { label?: string }>)?.[key]?.label ?? fallback;

// Hauteur fixe de la zone de liste. La card ne change jamais de taille :
// quand un menu s'ouvre, c'est cette zone qui devient scrollable.
const LIST_HEIGHT = "h-[240px]";

// Rayon du rectangle "Ajoutez vos adresses" — modifiable ici uniquement.
const FOOTER_RADIUS = "rounded-xl";

// Séparateur fin entre chaque élément principal (catégories / choix uniques uniquement).
const ROW_DIVIDER =
  "relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[70%] after:border-b after:border-gray-100 dark:after:border-white/10";
// Espacement vertical du texte par rapport aux barres.
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

const PoiWidget = ({ enabledPoiTypes, onTogglePoi, currentZoom, minZoomForPois }: PoiWidgetProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  // Sait si la liste dépasse sa hauteur fixe (donc si des éléments défilent
  // sous le bouton "Ajoutez vos adresses") pour afficher le fondu brumeux.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    setIsScrollable(el.scrollHeight > el.clientHeight + 1);
  }, [expanded]);

  const isChecked = (type: string) => enabledPoiTypes.includes(type);

  // Comportement inchangé : on ne fait qu'appeler onTogglePoi comme avant.
  const handleToggle = (type: string) => {
    const isCurrentlyEnabled = enabledPoiTypes.includes(type);
    onTogglePoi(type, !isCurrentlyEnabled);
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Coche/décoche tous les enfants d'une catégorie en un clic sur le checkbox parent.
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
          <p className="text-[10px] text-gray-500 dark:text-[#999999] mt-1">Zoomez pour afficher les résultats</p>
        )}
      </div>

      {/* Liste — hauteur fixe, défilement interne quand des catégories sont ouvertes */}
      <div ref={listRef} className={`${LIST_HEIGHT} overflow-y-auto custom-scrollbar`}>
        {POI_CATEGORIES.map((category) => {
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
                  {getLabel(category.key, category.label)}
                </span>
              </button>
            );
          }

          const isOpen = !!expanded[category.key];
          const hasChildren = category.children.length > 0;
          const allChecked = hasChildren && category.children.every((child) => isChecked(child.key));

          return (
            <div key={category.key}>
              <button
                onClick={() => toggleExpand(category.key)}
                className={`w-full px-4 ${ROW_PADDING} flex items-center gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${ROW_DIVIDER}`}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasChildren) handleToggleGroup(category.children);
                  }}
                >
                  <Checkbox checked={allChecked} />
                </span>
                <span className="text-sm flex-1 text-left text-gray-700 dark:text-gray-300">
                  {getLabel(category.key, category.label)}
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
                      onClick={() => handleToggle(child.key)}
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
                        {getLabel(child.key, child.label)}
                      </span>
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* Footer — rectangle fixe qui marque la fin de la card ; la liste défile derrière lui */}
      <div className="relative flex-shrink-0">
        {isScrollable && (
          <div className="pointer-events-none absolute -top-4 inset-x-0 h-4 bg-gradient-to-b from-transparent to-white dark:to-[#0A0A0A]" />
        )}
        <div className="p-2 bg-white dark:bg-[#0A0A0A]">
          <button
            className={`w-full px-4 py-2.5 flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer ${FOOTER_RADIUS}`}
          >
            <Plus size={14} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Ajoutez vos adresses</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoiWidget;