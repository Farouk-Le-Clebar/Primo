import React from "react";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WidgetCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  headerAction?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  isEmpty?: boolean;
  children: React.ReactNode;
}

export const WidgetCard = ({ 
  title,
  subtitle,
  icon: Icon, 
  iconColorClass = "bg-blue-50 text-blue-600",
  headerAction,
  loading = false,
  loadingText = "Chargement...",
  emptyText = "Aucune donnée disponible",
  isEmpty = false,
  children 
}: WidgetCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md flex items-center justify-center ${iconColorClass}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wide">
              {title}
            </h3>
            {subtitle && (
              <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
            )}
          </div>
        </div>
        {headerAction && (
          <div className="flex-shrink-0 ml-4">
            {headerAction}
          </div>
        )}

      </div>
      <div className="bg-gray-50/50 p-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-4">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">{loadingText}</span>
          </div>
        ) : isEmpty ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-4 text-center">
            <span className="text-sm">{emptyText}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};