import { useEffect } from "react";

type MapPanelProps = {
  id: string;
  label: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function MapPanel({ id, label, onClose, children }: MapPanelProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <section
      id={id}
      aria-label={label}
      className="glass fixed inset-0 z-30 flex flex-col overflow-hidden pt-14 pointer-events-auto"
    >
      {children}
    </section>
  );
}
