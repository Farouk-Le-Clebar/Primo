import { NavLink, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type CustomNavLinkProps = {
  to?: string; // Optionnel maintenant pour autoriser les boutons
  label: string;
  icon?: React.ReactNode;
  rounded?: string;
  className?: string;
  iconColor?: string;
  textColor?: string;
  textHoverColor?: string;
  onClick?: () => void;
  // Nouvelles options pour le style Dropdown
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

  // Gestion des couleurs dynamique
  const colors = isDanger 
    ? "text-red-600 hover:bg-red-50 hover:text-red-700" 
    : `${isActive ? "bg-gray-100 text-black" : `bg-white ${textColor} hover:bg-gray-100 hover:${textHoverColor}`}`;

  const sharedClasses = `
    flex items-center justify-between px-3 transition-all duration-200 
    ${rounded} font-medium ${className} ${colors} group
  `;

  // Contenu intérieur du bouton/lien
  const content = (
    <>
      <div className={`flex items-center ${gap}`}>
        {icon && <div className={`${isDanger ? "text-red-500" : iconColor} flex items-center`}>{icon}</div>}
        <span className={`${!showChevronOnHover ? "text-xs" : "text-sm"} font-[var(--font-UberMove)]`}>
            {label}
        </span>
      </div>

      {/* Logique du Chevron : soit permanent (isActive), soit au Hover (Dropdown) */}
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

  // Si "to" est présent, on utilise NavLink, sinon un simple button
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