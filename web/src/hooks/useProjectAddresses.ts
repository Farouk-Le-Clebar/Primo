import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addAddressToProject, deleteAddressFromProject, getAddressesOfProject } from "../requests/projects";
import type { CreateProjectAddressPayload, ProjectAddress } from "../types/project/addresses";

type AddAddressVariables = {
    projectId: string;
    payload: CreateProjectAddressPayload;
};

export const projectAddressesKey = (projectId: string | undefined) => ["project", projectId, "addresses"];

export function useProjectAddresses(projectId: string | undefined) {
    return useQuery<ProjectAddress[]>({
        queryKey: projectAddressesKey(projectId),
        queryFn: () => getAddressesOfProject(projectId!),
        enabled: !!projectId,
        refetchOnWindowFocus: false,
    });
}

export function useAddProjectAddress(onSuccess: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ projectId, payload }: AddAddressVariables) => addAddressToProject(projectId, payload),
        onSuccess: (_, { projectId }) => {
            queryClient.invalidateQueries({ queryKey: projectAddressesKey(projectId) });
            toast.success("Adresse ajoutée au projet.", { id: "add-address-success" });
            onSuccess();
        },
        onError: () => {
            toast.error("Impossible d'ajouter l'adresse. Réessayez plus tard.", { id: "add-address-error" });
        },
    });
}

export function useDeleteProjectAddress(projectId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (addressId: string) => deleteAddressFromProject(projectId!, addressId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectAddressesKey(projectId) });
            toast.success("Adresse supprimée.", { id: "delete-address-success" });
        },
        onError: () => {
            toast.error("Impossible de supprimer l'adresse. Réessayez plus tard.", { id: "delete-address-error" });
        },
    });
}
