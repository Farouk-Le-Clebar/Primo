import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@tremor/react";
import { MapPin, Plus, Trash } from "lucide-react";
import LoadingPrimoLogo from "../../../../components/animations/LoadingPrimoLogo";
import AddProjectAddressModal from "../../../../components/projectAddresses/AddProjectAddressModal";
import { useDeleteProjectAddress, useProjectAddresses } from "../../../../hooks/useProjectAddresses";

const CARD_CLASS = "flex items-start gap-3 rounded-xl border-gray-200 p-4 shadow-sm ring-0 dark:border-white/10 dark:bg-[#171717]";
const HINT_CLASS = "text-xs text-gray-500 dark:text-gray-400";

const AddressesTab = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { data: addresses, isPending } = useProjectAddresses(projectId);
    const { mutate: deleteAddress, isPending: isDeleting } = useDeleteProjectAddress(projectId);

    const handleOpenAdd = () => setIsAddOpen(true);
    const handleCloseAdd = () => setIsAddOpen(false);

    if (isPending)
        return <LoadingPrimoLogo />;

    return (
        <div className="flex flex-col gap-4 p-6 font-inter">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Adresses du projet</h3>
                    <p className={HINT_CLASS}>Visibles sur la carte et dans le détail des parcelles par tous les membres.</p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer"
                >
                    <Plus size={14} strokeWidth={2} />
                    Ajouter une adresse
                </button>
            </div>

            {addresses?.length === 0 && <p className={HINT_CLASS}>Aucune adresse dans ce projet.</p>}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {addresses?.map((address) => (
                    <Card key={address.id} className={CARD_CLASS}>
                        <MapPin size={18} className="mt-0.5 shrink-0 text-gray-500 dark:text-gray-400" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{address.address}</p>
                            {address.description && <p className={`mt-1 whitespace-pre-line ${HINT_CLASS}`}>{address.description}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => deleteAddress(address.id)}
                            disabled={isDeleting}
                            aria-label="Supprimer l'adresse"
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 cursor-pointer disabled:opacity-50"
                        >
                            <Trash size={16} />
                        </button>
                    </Card>
                ))}
            </div>

            {isAddOpen && <AddProjectAddressModal onClose={handleCloseAdd} projectId={projectId} />}
        </div>
    );
};

export default AddressesTab;
