import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface WidgetProps {
  title: string;
  icon: LucideIcon;
  iconColorClass?: string;
  badge?: string | number;
  loading?: boolean;
  children: React.ReactNode;
}

export const Widget = ({ 
  title, 
  icon: Icon, 
  iconColorClass = "bg-blue-50 text-blue-600", 
  badge, 
  loading, 
  children 
}: WidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white select-none border-b border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${iconColorClass}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-gray-800 font-semibold text-sm uppercase tracking-wide">{title}</h3>
            {!loading && badge !== undefined && (
              <span className="text-xs text-gray-400 font-medium">{badge}</span>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="bg-gray-50/50 p-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};