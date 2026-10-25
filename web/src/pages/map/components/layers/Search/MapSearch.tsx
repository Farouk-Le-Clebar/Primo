import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";
import { useAddressSearch } from "../../../../../hooks/useAddressSearch";
import { useMapSearchItems, type MapSearchItem } from "./useMapSearchItems";
import MapSearchResults from "./MapSearchResults";

type MapSearchProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdressSelect: (coords: [number, number]) => void;
};

const SHORTCUT = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl K";
const KBD = "rounded-md border border-black/10 px-1.5 py-0.5 font-sans text-[11px] font-medium text-gray-500 dark:border-white/15 dark:text-gray-400";
const HINTS = [
  ["↑↓", "naviguer"],
  ["↵", "localiser"],
  ["esc", "fermer"],
];

export default function MapSearch({ isOpen, onOpenChange, onAdressSelect }: MapSearchProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleClose = () => onOpenChange(false);
  const state = useAddressSearch(isOpen, onAdressSelect, handleClose);
  const { query, status, items, isHistoryLoading } = useMapSearchItems(state, isOpen);
  const ref = useOutsideClick(handleClose);

  useEffect(() => setActiveIndex(0), [status, items.length, query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const handleSelect = (item: MapSearchItem) => state.handleSelect(item.coords, item.label);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + step + items.length) % items.length);
    }
    if (event.key === "Enter") handleSelect(items[activeIndex]);
  };

  return (
    <div
      ref={ref}
      className="glass absolute top-20 left-6 z-30 w-[min(440px,calc(100vw-3rem))] overflow-hidden rounded-xl border border-black/[0.08] shadow-xl pointer-events-auto dark:border-white/10"
    >
      <div className={`flex items-center gap-2.5 px-3 transition-[padding] duration-150 ${isOpen ? "py-2.5" : "py-1.5"}`}>
        <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-gray-900 dark:text-white" aria-hidden="true" />
        {isOpen ? (
          <input
            autoFocus
            role="combobox"
            aria-expanded={items.length > 0}
            aria-label="Rechercher une adresse"
            placeholder="Adresse, ville, code postal…"
            value={state.address}
            onChange={(event) => state.setAddress(event.target.value)}
            onKeyDown={handleInputKeyDown}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400 dark:text-white"
          />
        ) : (
          <button
            onClick={() => onOpenChange(true)}
            className="min-w-0 flex-1 py-0.5 text-left text-sm text-gray-500 transition-colors duration-150 hover:text-gray-900 cursor-text dark:text-gray-400 dark:hover:text-white"
          >
            Rechercher une adresse
          </button>
        )}
        {isOpen ? (
          <button
            onClick={handleClose}
            aria-label="Fermer la recherche"
            className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-900 transition-colors duration-150 hover:bg-black/[0.05] cursor-pointer dark:text-white dark:hover:bg-white/[0.08]"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <kbd className={KBD}>{SHORTCUT}</kbd>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.17, ease: "easeOut" }}
          >
            <div className="scrollbar-glass max-h-[min(380px,55vh)] overflow-y-auto border-t border-black/[0.06] px-2 pt-3 pb-2 dark:border-white/10">
              <MapSearchResults
                status={status}
                items={items}
                query={query}
                activeIndex={activeIndex}
                isHistoryLoading={isHistoryLoading}
                onHover={setActiveIndex}
                onSelect={handleSelect}
                onRetry={() => void state.search.refetch()}
              />
            </div>
            <div className="flex items-center gap-4 border-t border-black/[0.06] px-4 py-2.5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
              {HINTS.map(([key, label]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <kbd className={KBD}>{key}</kbd>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
