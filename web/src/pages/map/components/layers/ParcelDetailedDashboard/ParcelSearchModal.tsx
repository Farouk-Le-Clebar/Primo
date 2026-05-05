import { Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

type SearchModalProps = { 
  isOpen: boolean; 
  onClose: () => void; 
  navigationData: any[];
  onNavigate: (tabId: string) => void;
};

export default function ParcelSearchModal({ isOpen, onClose, navigationData, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const allItems = navigationData.flatMap(cat => 
    cat.type === "single" 
      ? [{ ...cat, category: cat.label }] 
      : cat.items.map((item: any) => ({ ...item, category: cat.label }))
  );

  const filtered = query ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : [];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setQuery("");
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-150" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            autoFocus
            type="text"
            placeholder="Tapez le nom d'un module ou d'une section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder-gray-400 font-inter"
          />
          
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-md px-2 py-1 bg-gray-50/50 select-none ml-2">
            <span className="text-[10px] font-mono font-bold text-gray-400">ESC</span>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {query === "" ? (
            navigationData.map((cat) => (
              <div key={cat.id} className="mb-2 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">
                  {cat.label}
                </div>
                {cat.type === "single" ? (
                  <button onClick={() => { onNavigate(cat.id); onClose(); }} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                    <span className="text-[14px] font-mono text-gray-300 w-4 text-center">#</span>
                    <span className="text-[13px] font-medium">{cat.label}</span>
                  </button>
                ) : (
                  cat.items.map((item: any) => (
                    <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }} className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                      <span className="text-[14px] font-mono text-gray-300 w-4 text-center">#</span>
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </button>
                  ))
                )}
              </div>
            ))
          ) : (
            filtered.length > 0 ? filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-mono text-gray-300 w-4 text-center">#</span>
                  <span className="text-[13px] font-medium">{item.label}</span>
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{item.category}</span>
              </button>
            )) : (
              <div className="px-4 py-8 text-center text-gray-400 text-[12px] italic">Aucun module ne correspond à "{query}"</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}