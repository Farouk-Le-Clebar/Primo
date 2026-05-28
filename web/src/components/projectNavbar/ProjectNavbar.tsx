import { Outlet, useParams } from "react-router-dom";
import CustomNavLink from "../../ui/Navlink";
import { LayoutDashboard, Map, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "../../requests/projects";
import LoadingPrimoLogo from "../animations/LoadingPrimoLogo";

const ProjectNavbar = () => {
    const { projectId } = useParams();
    const { data: project, isPending } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId!),
        refetchOnWindowFocus: false,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-full dark:invert">
                <LoadingPrimoLogo className="h-10 w-10" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200">
            <div className="w-full h-14 border-b border-gray-200 dark:border-white/10 flex items-center gap-6 px-6">

                <div className="flex items-center h-8 pr-6 border-r border-gray-200 dark:border-white/10 w-60 shrink-0">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate block w-full" title={project?.name}>
                        {project?.name}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <CustomNavLink
                        to={`/projects/${projectId}/dashboard`}
                        textColor="text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:text-gray-900 dark:hover:text-white"
                        rounded="rounded-md"
                        label="Dashboard"
                        icon={<LayoutDashboard className="w-4 h-4 mr-2" />}
                        className="h-9"
                        BgColor="bg-transparent"
                        hoverBgColor="hover:bg-gray-100 dark:hover:bg-white/5"
                    />

                    <CustomNavLink
                        to={`/projects/${projectId}/plots`}
                        textColor="text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:text-gray-900 dark:hover:text-white"
                        rounded="rounded-md"
                        label="Parcelles"
                        icon={<Map className="w-4 h-4 mr-2" />}
                        className="h-9"
                        BgColor="bg-transparent"
                        hoverBgColor="hover:bg-gray-100 dark:hover:bg-white/5"
                    />

                    <CustomNavLink
                        to={`/projects/${projectId}/members`}
                        textColor="text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors hover:text-gray-900 dark:hover:text-white"
                        rounded="rounded-md"
                        label="Membres"
                        icon={<Users className="w-4 h-4 mr-2" />}
                        className="h-9"
                        BgColor="bg-transparent"
                        hoverBgColor="hover:bg-gray-100 dark:hover:bg-white/5"
                    />
                </div>
            </div>

            <div className="flex-1 w-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default ProjectNavbar;