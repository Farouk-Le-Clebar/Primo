import { useQuery } from "@tanstack/react-query";
import { Select, SelectItem } from "@tremor/react";
import { getProjects } from "../../requests/projects";
import type { ProjectResponse } from "../../types/project/projects";

type ProjectSelectProps = {
    value: string;
    onChange: (projectId: string) => void;
    placeholder?: string;
    className?: string;
};

const ProjectSelect = ({ value, onChange, placeholder = "-- Choisir un projet --", className = "" }: ProjectSelectProps) => {
    const { data: projects } = useQuery<ProjectResponse[]>({
        queryKey: ["projects"],
        queryFn: getProjects,
        refetchOnWindowFocus: false,
    });

    return (
        <div data-map-passthrough className={className}>
            <Select
                value={value}
                onValueChange={onChange}
                placeholder={placeholder}
                className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
            >
                {projects?.length === 0 ? (
                    <SelectItem value="">Aucun projet trouvé</SelectItem>
                ) : (
                    projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                            {project.name}
                        </SelectItem>
                    ))
                )}
            </Select>
        </div>
    );
};

export default ProjectSelect;
