import LoadingPrimoLogo from "../../../../../../../components/animations/LoadingPrimoLogo";

export function WidgetLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 font-inter">
      <LoadingPrimoLogo className="h-6 w-6" />
      <span className="text-[11px] font-medium text-[#878D96] dark:text-gray-400">{label}</span>
    </div>
  );
}

type WidgetEmptyProps = {
  message: string;
  onRetry?: () => void;
};

export function WidgetEmpty({ message, onRetry }: WidgetEmptyProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-8 text-center font-inter text-sm text-[#878D96] dark:border-white/10 dark:bg-[#171717] dark:text-gray-400">
      {message}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 block w-full font-medium text-emerald-700 underline dark:text-emerald-400"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

export function SourceNote({ children }: { children: string }) {
  return <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{children}</p>;
}
