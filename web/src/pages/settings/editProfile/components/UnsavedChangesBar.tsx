import { AnimatePresence, motion } from "framer-motion";

type UnsavedChangesBarProps = {
  isVisible: boolean;
  isPending: boolean;
  onDiscard: () => void;
  onSave: () => void;
};

export default function UnsavedChangesBar({ isVisible, isPending, onDiscard, onSave }: UnsavedChangesBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="glass fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-black/5 py-2 pr-2 pl-4 shadow-2xl dark:border-white/10"
        >
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500 motion-reduce:animate-none" aria-hidden="true" />
          <p className="flex-1 truncate text-sm text-gray-700 dark:text-gray-200">Modifications non enregistrées</p>
          <button type="button" onClick={onDiscard} className="h-8 rounded-lg px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-black/[0.05] cursor-pointer dark:text-gray-300 dark:hover:bg-white/[0.08]">
            Annuler
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="h-8 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition-opacity hover:opacity-80 cursor-pointer disabled:opacity-40 dark:bg-white dark:text-black"
          >
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
