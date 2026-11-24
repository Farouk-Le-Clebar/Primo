import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  size?: ModalSize;
  footer?: React.ReactNode;
  bodyClassName?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const WIDTHS: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
};

export default function Modal({ title, subtitle, icon: Icon, size = "md", footer, bodyClassName = "", onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      onMouseDown={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1c1c1e]/40 px-4 py-6 backdrop-blur-[6px] dark:bg-black/60"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={`flex max-h-full w-full ${WIDTHS[size]} flex-col overflow-hidden rounded-2xl border border-[#1c1c1e]/8 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#1c1c1e] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]`}
      >
        <header className="flex items-start gap-3 px-6 pb-4 pt-5">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1c1c1e]/6 text-[#1c1c1e] dark:bg-white/8 dark:text-white">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#1c1c1e] dark:text-[#fafafa]">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-[#82828c]">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Fermer" className="group -mr-1.5 rounded-lg p-1.5 text-[#82828c] transition-colors hover:bg-[#1c1c1e]/5 hover:text-[#1c1c1e] dark:hover:bg-white/7 dark:hover:text-white">
            <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </header>
        <div className={`scrollbar-glass min-h-0 flex-1 overflow-y-auto px-6 pb-6 ${bodyClassName}`}>{children}</div>
        {footer && <footer className="flex items-center justify-end gap-2 border-t border-[#1c1c1e]/8 px-6 py-4 dark:border-white/8">{footer}</footer>}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
