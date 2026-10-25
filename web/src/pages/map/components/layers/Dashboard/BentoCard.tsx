import { Card } from "@tremor/react";

type BentoCardProps = {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export default function BentoCard({ title, action, className = "", bodyClassName = "", children }: BentoCardProps) {
  return (
    <Card className={`flex flex-col overflow-hidden rounded-xl border-gray-200 p-0 shadow-sm ring-0 dark:border-white/10 ${className}`}>
      {title && (
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-gray-200 px-5 py-2.5 dark:border-white/10">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          {action}
        </div>
      )}
      <div className={`min-h-0 flex-1 p-5 ${bodyClassName}`}>{children}</div>
    </Card>
  );
}
