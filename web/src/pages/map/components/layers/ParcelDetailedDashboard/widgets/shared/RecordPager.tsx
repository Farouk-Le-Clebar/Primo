export default function RecordPager({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (total <= pageSize) return null;
  const pages = Math.ceil(total / pageSize);
  return (
    <div className="mt-5 flex items-center justify-between gap-3 text-xs text-gray-500">
      <button
        className="rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-40 dark:border-white/10"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        Précédent
      </button>
      <span>
        Page {page + 1} / {pages}
      </span>
      <button
        className="rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-40 dark:border-white/10"
        disabled={page + 1 >= pages}
        onClick={() => onChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  );
}
