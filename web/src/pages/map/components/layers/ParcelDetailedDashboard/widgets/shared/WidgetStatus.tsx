import { CloudOff, RotateCw, SearchX, type LucideIcon } from "lucide-react";
import EmptyState from "../../../../../../../ui/EmptyState";
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
  title?: string;
  icon?: LucideIcon;
  onRetry?: () => void;
};

export function WidgetEmpty({ message, title, icon, onRetry }: WidgetEmptyProps) {
  return (
    <EmptyState
      icon={icon ?? (onRetry ? CloudOff : SearchX)}
      title={title ?? (onRetry ? "Service momentanément indisponible" : "Rien à signaler ici")}
      description={message}
      action={onRetry ? { label: "Réessayer", onClick: onRetry, icon: RotateCw } : undefined}
      size="sm"
    />
  );
}

export function SourceNote({ children }: { children: string }) {
  return <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{children}</p>;
}
