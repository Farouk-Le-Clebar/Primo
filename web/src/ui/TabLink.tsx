import { ChevronRight } from "lucide-react";

type TabLinkProps = {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: (id: string) => void;
  rounded?: string;
  className?: string;
};

export default function TabLink({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
  rounded = "rounded-xl",
  className = "h-8",
}: TabLinkProps) {
  
  const colors = isActive 
    ? "bg-gray-100 text-black" 
    : "bg-transparent text-[#757575] hover:bg-gray-100 hover:text-black";

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`w-full flex items-center justify-between px-3 transition-all duration-300 group ${className} ${rounded} ${colors}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <Icon className="w-full h-full" />
        </div>
        <span className="whitespace-nowrap font-inter font-medium text-sm transition-all duration-300">
          {label}
        </span>
      </div>
      <div className="flex items-center">
        <ChevronRight
          size={14}
          className={`transition-all duration-200 ${
            isActive 
              ? "text-black opacity-100 translate-x-0" 
              : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}