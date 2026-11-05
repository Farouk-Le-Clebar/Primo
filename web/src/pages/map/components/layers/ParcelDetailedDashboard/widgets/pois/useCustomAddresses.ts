import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../../../../../../requests/projects";
import { useProjectAddresses } from "../../../../../../../hooks/useProjectAddresses";
import type { ProjectResponse } from "../../../../../../../types/project/projects";
import type { InfraCategory } from "./constants";
import { CUSTOM_FAMILY, getCustomLabel, toCustomCode, type CustomAddressContext } from "./customAddresses";

export function useCustomAddresses() {
    const [projectId, setProjectId] = useState("");
    const { data: addresses } = useProjectAddresses(projectId || undefined);
    const { data: projects } = useQuery<ProjectResponse[]>({
        queryKey: ["projects"],
        queryFn: getProjects,
        refetchOnWindowFocus: false,
    });

    const projectName = projects?.find((project) => project.id === projectId)?.name ?? "";

    const context = useMemo<CustomAddressContext>(
        () => ({ byCode: new Map((addresses ?? []).map((address) => [toCustomCode(address.id), address])), projectName }),
        [addresses, projectName],
    );

    const category = useMemo<InfraCategory>(
        () => ({
            label: CUSTOM_FAMILY,
            types: (addresses ?? []).map((address) => ({ code: toCustomCode(address.id), label: getCustomLabel(address) })),
        }),
        [addresses],
    );

    return { projectId, setProjectId, context, category };
}
