type SectionCardProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export default function SectionCard({ title, subtitle, action, className = "", children }: SectionCardProps) {
  return (
    <section className={`primo-card animate-fade-in flex flex-col p-5 ${className}`}>
      <header className="mb-1 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-[#1c1c1e] dark:text-[#fafafa]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[#82828c]">{subtitle}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
