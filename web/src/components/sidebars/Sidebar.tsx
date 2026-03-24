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

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>, extraClasses = "") => (
    <div className={`transition-all duration-300 flex items-center justify-center ${
      isExpanded ? "w-5 h-5" : "w-5 h-5"
    } ${extraClasses}`}>
      <IconComponent className="w-full h-full" />
    </div>
  );

  return (
    <nav className="flex flex-col h-full w-full overflow-hidden">
      <div className="p-4 mt-2">
        <UserProfileSidebar isExpanded={isExpanded} />
      </div>

      <div className="flex-1 flex flex-col gap-6 p-4 overflow-y-auto overflow-x-hidden">
        
        <section className="flex flex-col gap-1">
          <div className="h-4 flex items-center px-2 mb-2">
            {isExpanded ? (
              <h3 className="font-inter font-medium text-[11px] uppercase tracking-[0.1em] text-[#757575] transition-opacity duration-300">
                Dashboard
              </h3>
            ) : (
              <div className="w-6 h-[2px] bg-gray-200 rounded-full mx-auto transition-all duration-300" />
            )}
          </div>

          <div className="space-y-1">
            <CustomNavLink
              to="/dashboard"
              textColor="text-[#000000]"
              rounded="rounded-xl"
              label={isExpanded ? "Aperçu" : ""}
              icon={renderIcon(OvervierIcon)}
              className="h-11"
            />
            <CustomNavLink
              to="/projects"
              rounded="rounded-xl"
              textColor="text-[#000000]"
              label={isExpanded ? "Projets" : ""}
              icon={renderIcon(ProjectIcon)}
              className="h-11"
            />
          </div>
        </section>

        <section className="flex flex-col gap-1">
          <div className="h-4 flex items-center px-2 mb-2">
            {isExpanded ? (
              <h3 className="font-inter font-medium text-[11px] uppercase tracking-[0.1em] text-[#757575] transition-opacity duration-300">
                Pages
              </h3>
            ) : (
              <div className="w-6 h-[2px] bg-gray-200 rounded-full mx-auto transition-all duration-300" />
            )}
          </div>

          <div className="space-y-1">
            <CustomNavLink
              to="/search"
              rounded="rounded-xl"
              textColor="text-[#000000]"
              label={isExpanded ? "Carte" : ""}
              icon={renderIcon(MapIcon)}
              className="h-11"
            />
            <CustomNavLink
              to="/ai-search"
              rounded="rounded-xl"
              textColor="text-[#000000]"
              label={isExpanded ? "IA Primo" : ""}
              icon={renderIcon(IaIcon)}
              className="h-11"
            />
            <CustomNavLink
              to="/support"
              rounded="rounded-xl"
              textColor="text-[#000000]"
              label={isExpanded ? "Support" : ""}
              icon={renderIcon(SupportIcon)}
              className="h-11"
            />
            {isAdmin && (
              <CustomNavLink
                to="/admin/dashboard"
                rounded="rounded-xl"
                textColor="text-[#000000]"
                label={isExpanded ? "Administration" : ""}
                icon={
                  <div className={`transition-all duration-300 ${isExpanded ? "w-5 h-5" : "w-6 h-6 scale-110"}`}>
                    <Lock className="w-full h-full text-red-800" />
                  </div>
                }
                className="h-11"
              />
            )}
          </div>
        </section>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="flex justify-center items-center p-4">
          <PrimoIcon className={`flex transition-all duration-300 ${isExpanded ? "w-6 h-auto" : "w-8 h-auto"}`} />
          <span
            className={`font-UberMove font-medium text-2xl tracking-tighter text-black transition-all duration-300  whitespace-nowrap ${
              isExpanded 
                ? "opacity-100 w-auto translate-x-0" 
                : "opacity-0 w-0 -translate-x-2 pointer-events-none"
            }`}
          >
            Primo
          </span>
        </div>
      </div>
    </nav>
  );
}