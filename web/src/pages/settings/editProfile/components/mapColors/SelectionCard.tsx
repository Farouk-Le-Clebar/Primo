import ColorSwatchGroup from "./ColorSwatchGroup";

type SelectionCardProps = {
  label: string;
  colors: string[];
  isActive: boolean;
  detail?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

const CARD = "flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors";
const ACTIVE = "border-gray-900 text-gray-900 dark:border-white dark:text-white";
const INACTIVE = "border-black/[0.06] text-gray-600 dark:border-white/10 dark:text-gray-300";
const INTERACTIVE = "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
const INACTIVE_HOVER = "hover:bg-black/[0.03] dark:hover:bg-white/[0.05]";

export default function SelectionCard({ label, colors, isActive, detail, ariaLabel, onClick }: SelectionCardProps) {
  const stateClass = isActive ? ACTIVE : INACTIVE;
  const content = (
    <>
      <span className="min-w-0">
        <span className="block">{label}</span>
        {detail && <span className="block font-mono text-xs font-normal text-gray-500 dark:text-gray-400">{detail}</span>}
      </span>
      <ColorSwatchGroup colors={colors} />
    </>
  );

  if (!onClick) return <div className={`${CARD} ${stateClass}`}>{content}</div>;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${CARD} ${INTERACTIVE} ${stateClass} ${isActive ? "" : INACTIVE_HOVER}`}
    >
      {content}
    </button>
  );
}
