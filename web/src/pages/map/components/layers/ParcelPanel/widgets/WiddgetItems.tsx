import React from "react";

interface StatBlockProps {
  label: string;
  value: string;
}

export const StatBlock = ({ label, value }: StatBlockProps) => (
  <div>
    <span className="text-[10px] uppercase text-gray-400 font-semibold block mb-1">
      {label}
    </span>
    <span className="text-gray-700 font-medium">{value}</span>
  </div>
);

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const MetricItem = ({ icon, label, value }: MetricItemProps) => (
  <div className="bg-white p-3 flex flex-col items-start hover:bg-gray-50 transition-colors">
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