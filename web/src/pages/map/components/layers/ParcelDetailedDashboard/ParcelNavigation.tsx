import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search} from "lucide-react";
import { NAVIGATION } from "./navigationConfig";

type Props = { activeTab: string; setActiveTab: (tab: string) => void; onOpenSearch: () => void; };

export default function ParcelNavigation({ activeTab, setActiveTab, onOpenSearch }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg" ref={containerRef}>
      {NAVIGATION.map((cat) => {
        const activeItem = cat.type === "dropdown" ? cat.items.find(i => i.id === activeTab) : null;
        const isCatActive = activeTab === cat.id || !!activeItem;

        if (cat.type === "single") {
          return (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)} 
              className={`flex items-center gap-2 px-3 py-1 rounded-md text-[12px] font-semibold transition-all ${
                activeTab === cat.id ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}>
              <cat.icon size={13} /> {cat.label}
            </button>
          );
        }
        return (
          <div key={cat.id} className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === cat.id ? null : cat.id)} 
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-[12px] font-semibold transition-all ${
                isCatActive ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}>
              <div className="flex items-center">
                <span>{cat.label}</span>
                {activeItem && (
                  <>
                    <div className="h-2.5 w-[1px] bg-gray-300 mx-1.5" />
                    <span className="text-blue-600">{activeItem.label}</span>
                  </>
                )}
              </div>
              <ChevronDown size={11} className={`ml-0.5 transition-transform opacity-40 ${openDropdown === cat.id ? "rotate-180" : ""}`} />
            </button>
            
            {openDropdown === cat.id && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                {cat.items.map((item) => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setOpenDropdown(null); }} 
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-[12px] text-left ${
                      activeTab === item.id ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    <span className={`text-[14px] font-mono ${activeTab === item.id ? "text-blue-400" : "text-gray-300"}`}>#</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="h-4 w-[1px] bg-gray-300 mx-0.5" />
      <button onClick={onOpenSearch} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white rounded-md transition-all border border-transparent hover:border-gray-200">
        <Search size={14} />
      </button>
    </nav>
  );
}