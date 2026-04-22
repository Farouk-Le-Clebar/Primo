import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type CustomNavLinkProps = {
  id?: string;
  to?: string;
  label: string;
  icon?: React.ReactNode;
  rounded?: string;
  className?: string;
  iconColor?: string;
  textColor?: string;
  textClass?: string;
  textHoverColor?: string;
  BgColor?: string;
  hoverBgColor?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  showChevronOnHover?: boolean;
  gap?: string;
};

export default function CustomNavLink({
  id,
  to,
  label,
  icon,
  rounded = "rounded-sm",
  className = "",
  iconColor = "text-black",
  textColor = "text-[#757575]",
  textClass = "",
  textHoverColor = "text-black",
  BgColor = "bg-white",
  hoverBgColor = "hover:bg-gray-100",
  onClick,
  variant = "default",
  showChevronOnHover = false,
  gap = "gap-2",
}: CustomNavLinkProps) {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;
  const isDanger = variant === "danger";
  const isCollapsed = label === "";

  const colors = isDanger
    ? "text-red-600 hover:bg-red-50 hover:text-red-700"
    : `${isActive ? "bg-gray-100 text-black" : `${BgColor} ${textColor} ${hoverBgColor} hover:${textHoverColor}`}`;

  const sizeClasses = isCollapsed
    ? "w-10 h-10 mx-auto justify-center px-0"
    : `w-full justify-between px-3 ${className} ${gap}`;

  const sharedClasses = `
    flex items-center transition-all duration-300
    ${sizeClasses}
    ${rounded} ${colors} group
  `;

  const content = (
    <>
      <div className={`flex items-center ${isCollapsed ? "justify-center" : gap}`}>
        {icon && (
          <div className={`${isDanger ? "text-red-500" : iconColor} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
        )}
        
        {!isCollapsed && (
          <span className={`whitespace-nowrap transition-all duration-300 ${
            textClass 
              ? textClass 
              : `${!showChevronOnHover ? "text-xs" : "text-sm"} font-inter font-medium`
          }`}>
            {label}
          </span>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex items-center">
          {showChevronOnHover ? (
            <ChevronRight
              size={14}
              className="transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400"
            />
          ) : (
            isActive && <ChevronRight className="w-4 h-4 text-black" />
          )}
        </div>
      )}
    </>
  );

  const finalProps = {
    id,
    onClick,
    className: sharedClasses,
    title: isCollapsed ? label : undefined 
  };

  if (to) {
    return (
      <NavLink to={to} {...finalProps}>
        {content}
      </NavLink>
    );
  }

  return (
    <button type="button" {...finalProps}>
      {content}
    </button>
  );
}