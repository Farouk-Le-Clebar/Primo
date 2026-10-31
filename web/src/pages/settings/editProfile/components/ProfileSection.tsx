import type { ReactNode } from "react";

type ProfileSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function ProfileSection({ title, description, children }: ProfileSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/5 bg-white/[0.78] dark:border-white/10 dark:bg-[#1c1c1e]/[0.82]">
      <header className="border-b border-black/[0.06] px-5 py-4 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </header>
      <div className="divide-y divide-black/[0.06] dark:divide-white/10">{children}</div>
    </section>
  );
}
