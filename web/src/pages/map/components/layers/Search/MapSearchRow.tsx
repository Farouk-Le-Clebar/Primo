import { useEffect, useRef } from "react";
import { ClockIcon } from "@heroicons/react/20/solid";
import type { MapSearchItem } from "./useMapSearchItems";

type MapSearchRowProps = {
  item: MapSearchItem;
  query: string;
  isActive: boolean;
  onHover: () => void;
  onSelect: () => void;
};

const highlight = (text: string, query: string): React.ReactNode => {
  const start = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent font-semibold text-inherit underline decoration-current/30 underline-offset-2">
        {text.slice(start, start + query.length)}
      </mark>
      {text.slice(start + query.length)}
    </>
  );
};

export default function MapSearchRow({ item, query, isActive, onHover, onSelect }: MapSearchRowProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: "nearest" });
  }, [isActive]);

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isActive}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-gray-900 transition-colors duration-100 cursor-pointer dark:text-white ${isActive ? "glass-selected" : ""}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold tabular-nums ${isActive ? "bg-black/[0.08] dark:bg-white/[0.14]" : "bg-black/[0.05] dark:bg-white/10"}`}
      >
        {item.department ?? <ClockIcon className="h-4 w-4" aria-hidden="true" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{highlight(item.title, query)}</span>
        <span className={"block truncate text-xs text-gray-500 dark:text-gray-400"}>
          {item.subtitle}
        </span>
      </span>
      {isActive && <span className="shrink-0 text-xs font-medium opacity-60">Localiser ↵</span>}
    </button>
  );
}
