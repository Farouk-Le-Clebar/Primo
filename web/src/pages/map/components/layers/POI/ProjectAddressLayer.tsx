import { memo } from "react";
import { useProjectAddresses } from "../../../../../hooks/useProjectAddresses";
import ProjectAddressMarker from "./ProjectAddressMarker";

type ProjectAddressLayerProps = {
    projectId: string;
    hidden: boolean;
};

const ProjectAddressLayer = ({ projectId, hidden }: ProjectAddressLayerProps) => {
    const { data: addresses } = useProjectAddresses(projectId || undefined);

    if (hidden || !addresses?.length) return null;

    return (
        <>
            {addresses.map((address) => (
                <ProjectAddressMarker key={address.id} address={address} />
            ))}
        </>
    );
};

export default memo(ProjectAddressLayer);
