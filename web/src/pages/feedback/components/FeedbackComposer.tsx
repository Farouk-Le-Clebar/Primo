import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { DESCRIPTION_MIN_LENGTH } from "../../../hooks/useFeedbackForm";
import type { useFeedbackForm } from "../../../hooks/useFeedbackForm";
import FeedbackCategoryPicker from "./FeedbackCategoryPicker";

type FeedbackComposerProps = {
  form: ReturnType<typeof useFeedbackForm>;
};

const IS_MAC = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);

export default function FeedbackComposer({ form }: FeedbackComposerProps) {
  const descriptionLength = form.description.trim().length;
  const progress = Math.min(descriptionLength / DESCRIPTION_MIN_LENGTH, 1);

  return (
    <form onSubmit={form.handleSubmit} onKeyDown={form.handleShortcut} className="flex flex-col">
      <div className="p-4">
        <FeedbackCategoryPicker value={form.category} onChange={form.setCategory} />
      </div>
      <div className="flex flex-col gap-1 border-t border-black/[0.06] px-5 pt-4 dark:border-white/10">
        <input
          value={form.title}
          onChange={(event) => form.setTitle(event.target.value)}
          placeholder={form.category.placeholder}
          aria-label="Titre du retour"
          autoFocus
          className="w-full bg-transparent text-lg font-semibold tracking-tight text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-300 dark:text-white dark:placeholder:text-gray-600"
        />
        <textarea
          value={form.description}
          onChange={(event) => form.setDescription(event.target.value)}
          placeholder="Décrivez ce qui se passe, ce que vous attendiez, et comment le reproduire..."
          aria-label="Description détaillée"
          rows={9}
          className="w-full resize-none bg-transparent py-2 text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
        />
      </div>
      <footer className="flex items-center gap-3 border-t border-black/[0.06] px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="relative h-1 w-16 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/10">
            <span
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${progress === 1 ? "bg-emerald-500" : "bg-gray-400"}`}
              style={{ width: `${progress * 100}%` }}
            />
          </span>
          {progress === 1 ? "Prêt à envoyer" : `${DESCRIPTION_MIN_LENGTH - descriptionLength} caractères restants`}
        </div>
        <span className="ml-auto hidden items-center gap-1 text-xs text-gray-400 sm:flex">
          <kbd className="rounded border border-black/10 px-1.5 font-sans dark:border-white/15">{IS_MAC ? "⌘" : "Ctrl"}</kbd>
          <kbd className="rounded border border-black/10 px-1.5 font-sans dark:border-white/15">Entrée</kbd>
        </span>
        <button
          type="submit"
          disabled={!form.isValid || form.isPending}
          className="ml-auto flex h-8 items-center gap-2 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition-opacity duration-150 hover:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 sm:ml-0 dark:bg-white dark:text-black"
        >
          <PaperAirplaneIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {form.isPending ? "Envoi..." : "Envoyer"}
        </button>
      </footer>
    </form>
  );
}
