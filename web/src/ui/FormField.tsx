type FormFieldProps = {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
};

export const FIELD_CLASS =
  "w-full rounded-lg border border-[#1c1c1e]/12 bg-transparent px-3 py-2.5 text-sm text-[#1c1c1e] outline-none transition-shadow placeholder:text-[#82828c] focus:border-[#1c1c1e]/25 focus:ring-2 focus:ring-[#1c1c1e]/8 dark:border-white/12 dark:text-white dark:focus:border-white/25 dark:focus:ring-white/8";

export default function FormField({ label, htmlFor, optional = false, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-[#52525b] dark:text-[#d4d4d8]">
        {label}
        {optional && <span className="font-normal text-[#82828c]"> · facultatif</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#82828c]">{hint}</p>}
    </div>
  );
}
