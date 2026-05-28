import { useState } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENTS
import CustomNavLink from "../../ui/Navlink";
import UserProfileSidebar from "./components/UserProfileSidebar";
import AddressSearchModal from "../../components/search/AddressSearchModal";

// ICONS
import OvervierIcon from "../../assets/icons/overview.svg?react";
import ProjectIcon from "../../assets/icons/project.svg?react";
import MapIcon from "../../assets/icons/map.svg?react";
import SupportIcon from "../../assets/icons/Support.svg?react";
import PrimoIcon from "../../assets/logos/logoPrimoWhite.svg?react";
import Search from "../../assets/icons/searchBlack.svg?react";
// import Ia from "../../assets/icons/ia.svg?react";
import Admin from "../../assets/icons/admin.svg?react";
import Feedback from "../../assets/icons/send.svg?react";
import FolderClose from "../../assets/icons/folderClose.svg?react"; 

import { useQuery } from "@tanstack/react-query";
import LoadingPrimoLogo from "../animations/LoadingPrimoLogo";
import { getProjects } from "../../requests/projects";

export default function Sidebar() {
  const isAdmin = JSON.parse(localStorage.getItem("user") || "null")?.isAdmin;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>) => (
    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
      <IconComponent className="w-full h-full" />
    </div>
  );

  const handleAddressSelect = (coords: [number, number]) => {
    setIsModalOpen(false);
    navigate("/search", { state: { centerOn: coords } });
  };

  const { data: projects, isPending } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <>
      <nav id="sidebar-tour" className="flex flex-col h-full w-full ">
        <div className="mt-1 transition-all duration-300 p-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-200/50 transition-colors select-none dark:hover:bg-[#0A0A0A]">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-black text-white flex-shrink-0 dark:bg-white">
              <PrimoIcon className="w-5 h-5 text-white fill-current dark:invert" />
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate text-black leading-tight dark:text-white">Primo</span>
              <span className="text-xs text-gray-500 truncate leading-tight dark:text-white">Version 1.0</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden dark:text-white transition-all duration-300 px-4 ">
          <section className="flex flex-col gap-1 w-full">

            <div className="space-y-1">
              <CustomNavLink
                id="sidebar-overview-tour"
                to="/dashboard"
                textColor="text-black dark:text-white dark:hover:text-white"
                rounded="rounded-lg"
                label="Aperçu"
                icon={renderIcon(OvervierIcon)}
                className="h-8"
                BgColor="bg-transparent"
                hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
              />

              <div
                onClickCapture={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="cursor-pointer dark:hover:bg-[#262626] hover:bg-gray-200/50 rounded-lg"
              >
                <CustomNavLink
                  id="sidebar-search-tour"
                  to=""
                  textColor="text-black dark:text-white"
                  rounded="rounded-lg"
                  label="Recherche"
                  icon={renderIcon(Search)}
                  className="h-8 pointer-events-none"
                  BgColor="bg-transparent"
                  hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
                />
              </div>

              {/* <CustomNavLink
                id="sidebar-ai-tour"
                to="/AI"
                textColor="text-black dark:text-white dark:hover:text-white"
                rounded="rounded-lg"
                label="Demandes IA"
                icon={renderIcon(Ia)}
                className="h-8"
                BgColor="bg-transparent"
                hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
              /> */}
              <CustomNavLink
                id="sidebar-project-tour"
                to="/projects"
                textColor="text-black dark:text-white dark:hover:text-white"
                rounded="rounded-lg"
                label="Projets"
                icon={renderIcon(ProjectIcon)}
                className="h-8"
                BgColor="bg-transparent"
                hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
              />
              <CustomNavLink
                id="sidebar-map-tour"
                to="/search"
                textColor="text-black dark:text-white dark:hover:text-white"
                rounded="rounded-lg"
                label="Carte"
                icon={renderIcon(MapIcon)}
                className="h-8"
                BgColor="bg-transparent"
                hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
              />
              {isAdmin && (
                <CustomNavLink
                  to="/admin/dashboard"
                  textColor="text-black dark:text-white dark:hover:text-white"
                  rounded="rounded-lg"
                  label="Administration"
                  icon={renderIcon(Admin)}
                  className="h-8"
                  BgColor="bg-transparent"
                  hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
                />
              )}
            </div>

          </section>

          <section className="flex flex-col gap-1 flex-1 min-h-0" id="sidebar-projects-tour">
            <div className="flex mb-2 flex-col space-y-2 flex-1 min-h-0">
              <h3 className="font-inter font-medium text-[12px] tracking-[0.1em] text-[#757575] dark:text-[#999999]">
                Projets
              </h3>

              <div className="flex flex-col gap-1 flex-1 overflow-y-auto scrollbar-custom">
                {isPending && (
                  <div className="h-full w-full flex items-center justify-center">
                    <LoadingPrimoLogo className="w-6 h-6 text-black dark:invert" />
                  </div>
                )}
                {!isPending && projects?.map((project: any) => (
                  <CustomNavLink
                    key={project.id}
                    to={`/projects/${project.id}/dashboard`}
                    textColor="text-black dark:text-white dark:hover:text-white"
                    rounded="rounded-lg"
                    label={project.name}
                    icon={renderIcon(FolderClose)}
                    className="h-8 shrink-0"
                    BgColor="bg-transparent"
                    hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-auto flex flex-col gap-1 px-4 pb-6 pt-2 dark:text-white">
          <div
            onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open("https://chat.whatsapp.com/FKq0VLrFo4u33nFyFWhaRn", "_blank", "noopener,noreferrer");
            }}
            className="cursor-pointer dark:hover:bg-[#262626] hover:bg-gray-200/50 rounded-lg"
          >
            <CustomNavLink
              id="sidebar-support-tour"
              to=""
              textColor="text-black dark:text-white"
              rounded="rounded-lg"
              label="Support"
              icon={renderIcon(SupportIcon)}
              className="h-8 pointer-events-none"
              BgColor="bg-transparent"
              hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
            />
          </div>

          <CustomNavLink
            id="sidebar-feedback-tour"
            to="/feedback"
            textColor="text-black dark:text-white"
            rounded="rounded-lg"
            label="Retours et suggestions"
            icon={renderIcon(Feedback)}
            className="h-8"
            BgColor="bg-transparent"
            hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
          />

          <div id="sidebar-user-tour" className="mt-3">
            <UserProfileSidebar />
          </div>
        </div>

      </nav>

      <AddressSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdressSelect={handleAddressSelect}
      />
    </>
  );
}