import { Card } from "@tremor/react";
import type { ReactNode } from "react";

export default function DataCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Card className="rounded-xl border-gray-200 dark:border-white/10 ring-0 shadow-sm p-5 font-inter">
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </Card>
  );
}
