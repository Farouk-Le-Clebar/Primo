import { Outlet } from "react-router-dom";
import CustomNavLink from "../../ui/Navlink";

const ProjectNavbar = () => {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full h-16 bg-gray flex items-center justify-between px-4">
                <CustomNavLink
                    id="sidebar-map-tour"
                    to="/search"
                    textColor="text-black dark:text-white dark:hover:text-white"
                    rounded="rounded-lg"
                    label="Carte"
                    icon={null}
                    className="h-8"
                    BgColor="bg-transparent"
                    hoverBgColor="hover:bg-gray-200/50 dark:hover:bg-[#262626]"
                />
            </div>
            <Outlet />
        </div>
    );
};

export default ProjectNavbar;