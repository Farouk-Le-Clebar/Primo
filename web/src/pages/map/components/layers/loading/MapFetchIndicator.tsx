import { AnimatePresence, motion } from "framer-motion";
import LoadingPrimoLogo from "../../../../../components/animations/LoadingPrimoLogo";
import type { ShapeLevel } from "../../../../../utils/map";

type MapFetchIndicatorProps = {
  isVisible: boolean;
  level: ShapeLevel;
};

const LEVEL_LABELS: Record<ShapeLevel, string> = {
  departements: "Chargement des départements",
  city: "Chargement des communes",
  divisions: "Chargement des sections",
  parcelles: "Chargement des parcelles",
};

export default function MapFetchIndicator({ isVisible, level }: MapFetchIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            key="map-fetch-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none fixed inset-x-0 top-14 z-[1005] h-0.5 overflow-hidden"
          >
            <div className="primo-progress-bar h-full w-1/3 bg-gradient-to-r from-transparent via-gray-900 to-transparent dark:via-white" />
          </motion.div>
          <motion.div
            key="map-fetch-pill"
            role="status"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="glass pointer-events-none fixed top-[4.5rem] left-1/2 z-[1005] flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/5 py-1.5 pr-3.5 pl-2.5 shadow-lg dark:border-white/10"
          >
            <LoadingPrimoLogo className="h-3.5 w-3.5 text-gray-900 dark:text-white" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{LEVEL_LABELS[level]}</span>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
