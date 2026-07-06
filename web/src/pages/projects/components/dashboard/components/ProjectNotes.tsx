import { Card, Title } from "@tremor/react";

export default function ProjectNotes({ notes }: { notes?: string }) {
  return (
    <Card className="p-0 border-gray-200 dark:border-white/10 ring-0 shadow-sm rounded-xl overflow-hidden flex flex-col">
      <div className="border-b border-gray-100 dark:border-white/5 px-5 py-3 flex items-center gap-2">
        <Title className="text-sm font-semibold text-gray-900 dark:text-white">Notes IA & Directives</Title>
      </div>
      <div className="p-5 flex-1 text-xs text-gray-600 dark:text-[#999999] leading-relaxed">
        {notes ? (
          <div className="whitespace-pre-wrap">
            {notes}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center italic text-gray-500 dark:text-[#999999]">
            Aucune note renseignée.
          </div>
        )}
      </div>
    </Card>
  );
}