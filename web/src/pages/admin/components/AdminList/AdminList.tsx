import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
} from "@tremor/react";

// COMPONENTS
import { getAdmins } from "../../../../requests/admin";
import type { UserType } from "../../../../types/admin";
import AddAdminModal from "./AddAdminModal";
import BentoCard from "../../../map/components/layers/Dashboard/BentoCard";

const AdminList = () => {
    const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);

    const { data: admins = [], isLoading } = useQuery({
        queryKey: ["users", "get", "admins"],
        queryFn: () => getAdmins(),
    });

    return (
        <BentoCard
            title="Liste des administrateurs"
            className="primo-page-enter"
            action={
                <div className="flex items-center gap-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                    <button
                        onClick={() => setAddAdminModalOpen(true)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-80 cursor-pointer dark:bg-white dark:text-black"
                    >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Ajouter un admin
                    </button>
                </div>
            }
        >
            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow className="border-b border-gray-200 dark:border-white/5">
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400">Nom complet</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400">Email</TableHeaderCell>
                            <TableHeaderCell className="text-gray-500 dark:text-gray-400">Dernière connexion</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.map((admin: UserType) => (
                            <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                                    {admin.firstName} {admin.surName}
                                </TableCell>
                                <TableCell className="text-gray-600 dark:text-gray-400">
                                    {admin.email}
                                </TableCell>
                                <TableCell className="tabular-nums text-gray-600 dark:text-gray-400">
                                    {admin.lastConnection 
                                        ? new Date(admin.lastConnection).toLocaleDateString('fr-FR', { 
                                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                          }) 
                                        : "Jamais"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {admins.length === 0 && !isLoading && (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                        Aucun administrateur trouvé.
                    </div>
                )}
            </div>
            <AddAdminModal 
                isOpen={addAdminModalOpen} 
                onClose={() => setAddAdminModalOpen(false)} 
            />
        </BentoCard>
    );
};

export default AdminList;