import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type CustomNavLinkProps = {
  to: string;
  label: string;
  icon?: React.ReactNode;
  rounded?: string;
  className?: string;
  iconColor?: string;
  textColor?: string;
  textHoverColor?: string;
  onClick?: () => void;
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
}: CustomNavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`
        flex items-center justify-between w-[85%] h-10 px-3
        transition-all duration-200 ${rounded} font-medium ${className}
        ${
          isActive
            ? "bg-gray-100 text-black"
            : `bg-white ${textColor} hover:bg-gray-100 hover:${textHoverColor}`
        }
      `}
    >
      <div className="flex items-center gap-2">
        {icon && <div className={`${iconColor} text-lg`}>{icon}</div>}
        <span className="text-xs font-[var(--font-UberMove)]">{label}</span>
      </div>

      {isActive && <ChevronRight className="w-4 h-4 text-black ml-7" />}
    </NavLink>
  );
}
