import React from "react";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
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
  loading = false,
  loadingText = "Chargement...",
  emptyText = "Aucune donnée disponible",
  isEmpty = false,
  children 
}: WidgetCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className={`p-2 rounded-md ${iconColorClass}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wide">{title}</h3>
          {subtitle && (
            <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="bg-gray-50/50 p-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-4">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">{loadingText}</span>
          </div>
        ) : isEmpty ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-4">
            <span className="text-sm">{emptyText}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

interface StatBlockProps {
  label: string;
  value: string;
}

export const StatBlock = ({ label, value }: StatBlockProps) => (
  <div>
    <span className="text-[10px] uppercase text-gray-400 font-semibold block mb-1">{label}</span>
    <span className="text-gray-700 font-medium">{value}</span>
  </div>
);

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const MetricItem = ({ icon, label, value }: MetricItemProps) => (
  <div className="bg-white p-3 flex flex-col items-start hover:bg-gray-50">
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
      {icon} {label}
    </span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

interface IconStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const IconStat = ({ icon, label, value }: IconStatProps) => (
  <div>
    <span className="flex items-center gap-1 text-[10px] uppercase text-gray-400 font-semibold mb-1">
      {icon} {label}
    </span>
    <span className="text-gray-700 font-medium truncate block">{value}</span>
  </div>
);