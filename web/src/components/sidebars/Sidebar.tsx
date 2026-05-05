import CustomNavLink from "../../ui/Navlink";
import UserProfileSidebar from "./components/UserProfileSidebar";

// ICONS
import OvervierIcon from "../../assets/icons/overview.svg?react";
import ProjectIcon from "../../assets/icons/project.svg?react";
import MapIcon from "../../assets/icons/map.svg?react";
import SupportIcon from "../../assets/icons/Support.svg?react";
import PrimoIcon from "../../assets/logos/logoPrimoWhite.svg?react";
import Search from "../../assets/icons/searchBlack.svg?react";
import Ia from "../../assets/icons/ia.svg?react";
import Admin from "../../assets/icons/admin.svg?react";
import Feedback from "../../assets/icons/send.svg?react";

export default function Sidebar() {
  const isAdmin = JSON.parse(localStorage.getItem("user") || "null")?.isAdmin;

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>) => (
    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
      <IconComponent className="w-full h-full" />
    </div>
  );

  return (
    <nav id="sidebar-tour" className="flex flex-col h-full w-full ">
      <div className="mt-1 transition-all duration-300 p-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-200/50 transition-colors select-none">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black text-white flex-shrink-0">
            <PrimoIcon className="w-5 h-5 text-white fill-current" />
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm truncate text-black leading-tight">Primo</span>
            <span className="text-xs text-gray-500 truncate leading-tight">Version 1.0</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden transition-all duration-300 px-4 ">
        <section className="flex flex-col gap-1 w-full">

          <div className="space-y-1">
            <CustomNavLink
              id="sidebar-overview-tour"
              to="/dashboard"
              textColor="text-black"
              rounded="rounded-lg"
              label="Aperçu"
              icon={renderIcon(OvervierIcon)}
              className="h-8 "
              BgColor="bg-[#FAFAFA]"
              hoverBgColor="hover:bg-gray-200/50"
            />
            <CustomNavLink
              id="sidebar-search-tour"
              to="/adress-search"
              textColor="text-black"
              rounded="rounded-lg"
              label="Recherche"
              icon={renderIcon(Search)}
              className="h-8"
              BgColor="bg-[#FAFAFA]"
              hoverBgColor="hover:bg-gray-200/50"
            />
            <CustomNavLink
              id="sidebar-ai-tour"
              to="/AI"
              textColor="text-black"
              rounded="rounded-lg"
              label="Demandes IA"
              icon={renderIcon(Ia)}
              className="h-8"
              BgColor="bg-[#FAFAFA]"
              hoverBgColor="hover:bg-gray-200/50"
            />
            <CustomNavLink
              id="sidebar-projects-tour"
              to="/projects"
              textColor="text-black"
              rounded="rounded-lg"
              label="Projets"
              icon={renderIcon(ProjectIcon)}
              className="h-8"
              BgColor="bg-[#FAFAFA]"
              hoverBgColor="hover:bg-gray-200/50"
            />
            <CustomNavLink
              id="sidebar-map-tour"
              to="/search"
              textColor="text-black"
              rounded="rounded-lg"
              label="Carte"
              icon={renderIcon(MapIcon)}
              className="h-8"
              BgColor="bg-[#FAFAFA]"
              hoverBgColor="hover:bg-gray-200/50"
            />
            {isAdmin && (
              <CustomNavLink
                to="/admin/dashboard"
                textColor="text-red-800 font-bold"
                rounded="rounded-lg"
                label="Administration"
                icon={renderIcon(Admin)}
                className="h-8"
                BgColor="bg-[#FAFAFA]"
                hoverBgColor="hover:bg-gray-200/50"
              />
            )}
          </div>
          
        </section>

        <section className="flex flex-col gap-1">
          <div className="h-4 flex items-center px-2 mb-2">
            <h3 className="font-inter font-medium text-[12px] tracking-[0.1em] text-[#757575]">
              Projets
            </h3>
          </div>
        </section>
      </div>

      <div className="mt-auto flex flex-col gap-1 px-4 pb-6 pt-2">
        <CustomNavLink 
          id="sidebar-support-tour"
          to="/support" 
          textColor="text-black" 
          rounded="rounded-lg" 
          label="Support" 
          icon={renderIcon(SupportIcon)} 
          className="h-8" 
          BgColor="bg-[#FAFAFA]"
          hoverBgColor="hover:bg-gray-200/50"
        />
        <CustomNavLink 
          id="sidebar-feedback-tour"
          to="/feedback" 
          textColor="text-black" 
          rounded="rounded-lg" 
          label="Retours et suggestions"
          icon={renderIcon(Feedback)} 
          className="h-8" 
          BgColor="bg-[#FAFAFA]"
          hoverBgColor="hover:bg-gray-200/50"
        />
        
        <div id="sidebar-user-tour" className="mt-3">
          <UserProfileSidebar />
        </div>
      </div>

    </nav>
  );
}