import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/20/solid";

type FeedbackSentProps = {
  onReset: () => void;
};

export default function FeedbackSent({ onReset }: FeedbackSentProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
      >
        <CheckIcon className="h-6 w-6" aria-hidden="true" />
      </motion.span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Merci, c'est bien reçu.</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        L'équipe lit chaque retour. Vous pourriez bientôt voir votre idée sur la carte.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 h-8 rounded-lg px-3.5 text-xs font-medium text-gray-900 transition-colors hover:bg-black/[0.05] cursor-pointer dark:text-white dark:hover:bg-white/[0.08]"
      >
        Envoyer un autre retour
      </button>
    </div>
  );
}
