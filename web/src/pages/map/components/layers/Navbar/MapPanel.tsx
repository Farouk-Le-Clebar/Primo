import { useEffect } from "react";
import { isTourRunning } from "../../../../../components/tour/startTour";

type MapPanelProps = {
  id: string;
  label: string;
  onClose: () => void;
  isOpaque?: boolean;
  children: React.ReactNode;
};

export default function MapPanel({ id, label, onClose, isOpaque = false, children }: MapPanelProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && !isTourRunning() && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <section
      id={id}
      aria-label={label}
      className={`${isOpaque ? "bg-white dark:bg-[#1c1c1e]" : "glass"} fixed inset-0 z-30 flex flex-col overflow-hidden pt-14 pb-[calc(4rem+env(safe-area-inset-bottom))] pointer-events-auto md:pb-0`}
    >
      {children}
    </section>
  );
}
