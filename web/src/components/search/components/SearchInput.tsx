import { Search } from "lucide-react";

type SearchInputProps = {
  address: string;
  setAddress: (val: string) => void;
  isPending: boolean;
};

export default function SearchInput({ address, setAddress, isPending }: SearchInputProps) {
  return (
    <div className="flex items-center px-4 py-3.5 border-b shrink-0">
      <Search className="text-gray-400 mr-3" size={20} />
      <input
        autoFocus
        type="text"
        placeholder="Rechercher une adresse, une ville..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-inter"
      />
      
      {isPending && <span className="text-xs text-gray-400 mr-2 animate-pulse">Recherche...</span>}

      <div className="flex items-center gap-1.5 border border-gray-200 dark:border-[#262626] rounded-md px-2 py-1 bg-gray-50/50 dark:bg-[#262626] select-none ml-2 shrink-0">
        <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-500">ESC</span>
      </div>
    </div>
  );
}