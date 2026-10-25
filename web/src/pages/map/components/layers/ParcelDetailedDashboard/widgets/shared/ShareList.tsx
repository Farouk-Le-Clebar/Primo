import type { ReactNode } from "react";

import { useRevealed } from "../../../../../../../hooks/useRevealed";

export type ShareItem = {
  key: string;
  label: string;
  count: number;
  badge?: ReactNode;
};

type ShareListProps = {
  items: ShareItem[];
  active?: string | null;
  onSelect?: (key: string | null) => void;
  barClass?: string;
};

export default function ShareList({ items, active = null, onSelect, barClass = "bg-emerald-500/15 dark:bg-emerald-500/20" }: ShareListProps) {
  const revealed = useRevealed();
  const max = Math.max(1, ...items.map((item) => item.count));
  const handleSelect = (key: string) => onSelect?.(active === key ? null : key);

  return (
    <ul className="primo-stagger flex flex-col gap-1.5">
      {items.map(({ key, label, count, badge }) => (
        <li key={key}>
          <button
            onClick={() => handleSelect(key)}
            disabled={!onSelect || !count}
            aria-pressed={onSelect ? active === key : undefined}
            className={`group relative flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 text-left text-xs transition-opacity focus-visible:outline-2 focus-visible:outline-emerald-600 disabled:cursor-default ${active && active !== key ? "opacity-40" : ""}`}
          >
            <span
              className={`absolute inset-y-0 left-0 rounded-md transition-[width] duration-500 ease-out ${barClass}`}
              style={{ width: revealed ? `${(count / max) * 100}%` : "0%" }}
            />
            {badge && <span className="relative shrink-0">{badge}</span>}
            <span className="relative min-w-0 flex-1 truncate text-gray-700 group-enabled:group-hover:text-gray-900 dark:text-gray-200 dark:group-enabled:group-hover:text-white">
              {label}
            </span>
            <span className="relative shrink-0 font-semibold tabular-nums text-gray-900 dark:text-white">{count}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
