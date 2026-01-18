import React from "react";
import { AlertTriangle } from "lucide-react";

interface RiskAlertProps {
  title: string;
  children: React.ReactNode;
}

export const RiskAlert: React.FC<RiskAlertProps> = ({ title, children }) => {
  return (
    <div className="not-prose my-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-bold text-red-900 mb-1 text-base">{title}</h4>
          <div className="text-red-800 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};
