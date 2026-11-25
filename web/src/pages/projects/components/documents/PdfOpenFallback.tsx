import { FileText } from "lucide-react";

type PdfOpenFallbackProps = { url: string; name: string };

export default function PdfOpenFallback({ url, name }: PdfOpenFallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <FileText className="h-12 w-12 text-[#82828c]" strokeWidth={1.25} />
      <p className="max-w-[260px] truncate text-sm font-semibold text-[#1c1c1e] dark:text-[#fafafa]">{name}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-[#1c1c1e] px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-[#1c1c1e]">
        Ouvrir le PDF
      </a>
    </div>
  );
}
