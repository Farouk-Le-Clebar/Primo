import { motion } from "framer-motion";
import type { FolderIcon } from "@heroicons/react/24/outline";

export type HeroIcon = typeof FolderIcon;

type NavTabProps = {
  icon: HeroIcon;
  label: string;
  active?: boolean;
  controls?: string;
  stacked?: boolean;
  tourId?: string;
  onClick: () => void;
};

export default function NavTab({ icon: Icon, label, active = false, controls, stacked = false, tourId, onClick }: NavTabProps) {
  return (
    <button
      data-tour={tourId}
      onClick={onClick}
      aria-pressed={active}
      aria-controls={controls}
      className={`group relative flex items-center justify-center focus-visible:outline-none ${stacked ? "h-16 flex-1" : "h-14"}`}
    >
      <span
        className={`flex items-center rounded-lg px-2.5 py-1.5 ${stacked ? "flex-col gap-1 text-[11px]" : "gap-1.5 text-[13px]"} tracking-[-0.01em] transition-colors duration-150 group-hover:bg-[#1c1c1e]/[0.07] group-focus-visible:outline-2 group-focus-visible:outline-emerald-600 dark:group-hover:bg-white/[0.07] ${active ? "font-medium text-[#1c1c1e] dark:text-white" : "font-normal text-[#1c1c1e]/60 dark:text-white/60"}`}
      >
        <Icon
          className={`${stacked ? "h-5 w-5" : "h-4 w-4"} transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-px group-hover:-rotate-10 group-hover:scale-112`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        {label}
      </span>
      {active ? (
        <motion.span
          layoutId="navbar-active-bar"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
          className={`absolute inset-x-3 h-0.5 bg-[#1c1c1e] dark:bg-white ${stacked ? "top-0 rounded-b-full" : "bottom-0 rounded-t-full"}`}
        />
      ) : (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-1 -translate-x-1/2 rounded-t-full bg-[#1c1c1e]/0 transition-all duration-200 group-hover:w-6 group-hover:bg-[#1c1c1e]/25 dark:group-hover:bg-white/30" />
      )}
    </button>
  );
}
