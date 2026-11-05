import { useState } from "react";
import { Plus } from "lucide-react";
import ProjectSelect from "../../../../../components/projectAddresses/ProjectSelect";
import AddProjectAddressModal from "../../../../../components/projectAddresses/AddProjectAddressModal";

type ProjectAddressesFooterProps = {
    projectId: string;
    onProjectChange: (projectId: string) => void;
};

const ProjectAddressesFooter = ({ projectId, onProjectChange }: ProjectAddressesFooterProps) => {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleOpenAdd = () => setIsAddOpen(true);
    const handleCloseAdd = () => setIsAddOpen(false);

    return (
        <div className="p-2 bg-white dark:bg-[#0A0A0A] flex flex-col gap-2">
            <ProjectSelect value={projectId} onChange={onProjectChange} placeholder="Adresses d'un projet" />
            <button
                type="button"
                onClick={handleOpenAdd}
                className="w-full px-4 py-2.5 flex items-center justify-center gap-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer rounded-xl"
            >
                <Plus size={14} className="text-gray-500 dark:text-gray-400" strokeWidth={2} />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Ajouter une adresse</span>
            </button>
            {isAddOpen && <AddProjectAddressModal onClose={handleCloseAdd} projectId={projectId || undefined} />}
        </div>
    );
};

export default ProjectAddressesFooter;
