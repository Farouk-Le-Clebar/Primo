import { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import AddressSearchModal from "./AddressSearchModal";

type SearchBarProps = {
  onAdressSelect: (coords: [number, number]) => void;
}

const SearchBar = ({ onAdressSelect }: SearchBarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const isMacOS = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
    setIsMac(isMacOS);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="relative flex items-center w-full h-8 flex-col group cursor-text"
      >
        <div className="relative w-full h-full bg-[#EFEFF4] rounded-xl border border-transparent group-hover:border-gray-200 transition-colors overflow-hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <div className="w-full h-full flex items-center pl-10 pr-2 text-sm text-gray-500 select-none">
            Rechercher une adresse...
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 border border-gray-200/80 rounded px-1.5 py-0.5 bg-white">
            <span className="text-[10px] font-medium text-gray-400">
              {isMac ? '⌘K' : 'Ctrl K'}
            </span>
          </div>
        </div>
      </button>

      <AddressSearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdressSelect={onAdressSelect}
      />
    </>
  );
};

export default SearchBar;