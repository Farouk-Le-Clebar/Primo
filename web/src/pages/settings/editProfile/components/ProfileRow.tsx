import type { ReactNode } from "react";

type ProfileRowProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};

export default function ProfileRow({ label, hint, htmlFor, children }: ProfileRowProps) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-900 dark:text-white">{label}</label>
        {hint && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
      <div className="flex shrink-0 sm:justify-end">{children}</div>
    </div>
  );
}
