import React from "react";

interface KeyStatProps {
  value: string;
  label: string;
}

export const KeyStat: React.FC<KeyStatProps> = ({ value, label }) => {
  return (
    <div className="not-prose my-6 p-5 bg-green-50 border-l-4 border-green-600 rounded-r-lg">
      <div className="text-3xl font-bold text-green-600 mb-1">{value}</div>
      <div className="text-gray-700 text-sm">{label}</div>
    </div>
  );
};
