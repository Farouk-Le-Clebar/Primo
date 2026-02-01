import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type CustomNavLinkProps = {
  to?: string;
  label: string;
  icon?: React.ReactNode;
  rounded?: string;
  className?: string;
  iconColor?: string;
  textColor?: string;
  textHoverColor?: string;
  onClick?: () => void;
  variant?: "default" | "danger"; 
  showChevronOnHover?: boolean;
  gap?: string;
};

export default function CustomNavLink({
  to,
  label,
  icon,
  rounded = "rounded-sm",
  className = "",
  iconColor = "text-black",
  textColor = "text-[#757575]",
  textHoverColor = "text-black",
  onClick,
  variant = "default",
  showChevronOnHover = false,
  gap = "gap-2",
}: CustomNavLinkProps) {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;
  const isDanger = variant === "danger";

  const colors = isDanger 
    ? "text-red-600 hover:bg-red-50 hover:text-red-700" 
    : `${isActive ? "bg-gray-100 text-black" : `bg-white ${textColor} hover:bg-gray-100 hover:${textHoverColor}`}`;

  const sharedClasses = `
    flex items-center justify-between px-3 transition-all duration-200 
    ${rounded} font-medium ${className} ${colors} group
  `;

  const content = (
    <>
      <div className={`${isDanger ? "text-red-500" : textColor} flex items-center ${gap}`}>
        {icon && <div className={`${isDanger ? "text-red-500" : iconColor} flex items-center`}>{icon}</div>}
        <span className={`${!showChevronOnHover ? "text-xs" : "text-sm"} font-[var(--font-UberMove)]`}>
            {label}
        </span>
      </div>

      {showChevronOnHover ? (
        <ChevronRight 
          size={14} 
          className={`transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${isDanger ? "text-red-400" : "text-gray-400"}`} 
        />
      ) : (
        isActive && <ChevronRight className="w-4 h-4 text-black ml-7" />
      )}
    </>
  );

  if (to) {
    return (
      <NavLink to={to} onClick={onClick} className={sharedClasses}>
        {content}
      </NavLink>
    );
  }

  return (
    <button onClick={onClick} className={sharedClasses}>
      {content}
    </button>
  );
}