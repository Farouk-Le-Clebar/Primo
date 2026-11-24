import { Loader2, type LucideIcon } from "lucide-react";

type ModalButtonVariant = "primary" | "secondary" | "danger";

type ModalButtonProps = {
  variant?: ModalButtonVariant;
  icon?: LucideIcon;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  form?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

const VARIANTS: Record<ModalButtonVariant, string> = {
  primary: "bg-[#1c1c1e] text-white hover:scale-[1.02] dark:bg-white dark:text-[#1c1c1e]",
  secondary: "border border-[#1c1c1e]/14 text-[#1c1c1e] hover:bg-[#1c1c1e]/4 dark:border-white/16 dark:text-[#fafafa] dark:hover:bg-white/6",
  danger: "bg-red-500 text-white hover:scale-[1.02] hover:bg-red-600",
};

export default function ModalButton({ variant = "primary", icon: Icon, isLoading = false, disabled = false, type = "button", form, onClick, children }: ModalButtonProps) {
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]}`}
    >
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : Icon && <Icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />}
      {children}
    </button>
  );
}
