import CustomNavLink from "../../ui/Navlink";
import UserProfileSidebar from "./components/UserProfileSidebar";
import { Lock } from "lucide-react";

// ICONS
import OvervierIcon from "../../assets/icons/overview.svg?react";
import ProjectIcon from "../../assets/icons/project.svg?react";
import MapIcon from "../../assets/icons/map.svg?react";
import IaIcon from "../../assets/icons/IaIcon.svg?react";
import SupportIcon from "../../assets/icons/Support.svg?react";
import PrimoIcon from "../../assets/logos/logoPrimoBlack.svg?react";

interface SidebarProps {
  isExpanded: boolean;
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  const isAdmin = JSON.parse(localStorage.getItem("user") || "null")?.isAdmin;

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>) => (
    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
      <IconComponent className="w-full h-full" />
    </div>
  );

  return (
    <nav className="flex flex-col h-full w-full overflow-hidden bg-white">
      <div className={`mt-2 transition-all duration-300 ${isExpanded ? "p-4" : "p-2"}`}>
        <UserProfileSidebar isExpanded={isExpanded} />
      </div>

      <div className={`flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden transition-all duration-300 ${isExpanded ? "p-4" : "p-2"}`}>
        
        <section className="flex flex-col gap-1">
          <div className="h-4 flex items-center px-2 mb-2">
            {isExpanded ? (
              <h3 className="font-inter font-medium text-[11px] uppercase tracking-[0.1em] text-[#757575]">
                Dashboard
              </h3>
            ) : (
              <div className="w-6 h-[2px] bg-gray-200 rounded-full mx-auto" />
            )}
          </div>

          <div className="space-y-1">
            <CustomNavLink
              to="/dashboard"
              textColor="text-black"
              rounded="rounded-xl"
              label={isExpanded ? "Aperçu" : ""}
              icon={renderIcon(OvervierIcon)}
              className="h-8"
            />
            <CustomNavLink
              to="/projects"
              textColor="text-black"
              rounded="rounded-xl"
              label={isExpanded ? "Projets" : ""}
              icon={renderIcon(ProjectIcon)}
              className="h-8"
            />
          </div>
        </section>

        <section className="flex flex-col gap-1">
          <div className="h-4 flex items-center px-2 mb-2">
            {isExpanded ? (
              <h3 className="font-inter font-medium text-[11px] uppercase tracking-[0.1em] text-[#757575]">
                Pages
              </h3>
            ) : (
              <div className="w-6 h-[2px] bg-gray-200 rounded-full mx-auto" />
            )}
          </div>

          <div className="space-y-1">
            <CustomNavLink to="/search" textColor="text-black" rounded="rounded-xl" label={isExpanded ? "Carte" : ""} icon={renderIcon(MapIcon)} className="h-8" />
            <CustomNavLink to="/ai-search" textColor="text-black" rounded="rounded-xl" label={isExpanded ? "IA Primo" : ""} icon={renderIcon(IaIcon)} className="h-8" />
            <CustomNavLink to="/support" textColor="text-black" rounded="rounded-xl" label={isExpanded ? "Support" : ""} icon={renderIcon(SupportIcon)} className="h-8" />
            {isAdmin && (
              <CustomNavLink
                to="/admin/dashboard"
                textColor="text-red-800 font-bold"
                rounded="rounded-xl"
                label={isExpanded ? "Administration" : ""}
                icon={<Lock size={16} className="text-red-800" />}
                className="h-8"
              />
            )}
          </div>
        </section>
      </div>

      <div className="mt-auto flex w-full items-center justify-center mb-6 ">
        <div className={`flex items-center transition-all duration-300 justify-center ${isExpanded ? "gap-0" : "gap-0"}`}>
          <PrimoIcon className="w-7 h-auto flex-shrink-0 text-black" />
          <span className={`font-UberMove font-medium text-2xl tracking-tighter text-black transition-all duration-300 whitespace-nowrap ${
              isExpanded 
                ? "opacity-100 w-auto translate-x-0" 
                : "opacity-0 w-0 -translate-x-2 pointer-events-none overflow-hidden"
            }`}>
            Primo
          </span>
        </div>
      </div>
    </nav>
  );
}