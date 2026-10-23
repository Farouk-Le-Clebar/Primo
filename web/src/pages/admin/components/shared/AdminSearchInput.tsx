import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type AdminSearchInputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export default function AdminSearchInput({ value, placeholder, onChange }: AdminSearchInputProps) {
  return (
    <label className="flex h-8 w-full max-w-64 items-center gap-2 rounded-lg bg-black/[0.04] px-2.5 text-gray-500 focus-within:ring-1 focus-within:ring-black/20 dark:bg-white/[0.06] dark:focus-within:ring-white/20">
      <MagnifyingGlassIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
      />
    </label>
  );
}
