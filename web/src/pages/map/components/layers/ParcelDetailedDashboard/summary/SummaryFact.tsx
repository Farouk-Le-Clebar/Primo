type SummaryFactProps = {
  label: string;
  value: string;
};

export default function SummaryFact({ label, value }: SummaryFactProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-100 py-2 text-sm first:border-t-0 dark:border-white/5">
      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="truncate text-right font-medium text-gray-900 dark:text-white">
        {value}
      </dd>
    </div>
  );
}
