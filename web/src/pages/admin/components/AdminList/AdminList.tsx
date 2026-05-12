import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import {
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Button,
    Title,
    Text
} from "@tremor/react";

// COMPONENTS
import { getAdmins } from "../../../../requests/admin";
import type { UserType } from "../../../../types/admin";
import AddAdminModal from "./AddAdminModal";

const AdminList = () => {
    const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);

    const { data: admins = [], isLoading } = useQuery({
        queryKey: ["users", "get", "admins"],
        queryFn: () => getAdmins(),
    });

    return (
        <Card className="w-full rounded-xl border border-gray-100 dark:border-[#171717] transition-colors duration-200 ring-0 dark:ring-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <Title className="text-gray-900 dark:text-white flex items-center gap-2">
                        Liste des administrateurs
                        {isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                    </Title>
                    <Text className="text-gray-500 dark:text-gray-400">
                        Gérez les membres ayant un accès complet au système.
                    </Text>
                </div>
                
                <Button 
                    icon={Plus} 
                    onClick={() => setAddAdminModalOpen(true)}
                    className="!bg-black hover:!bg-gray-800 !text-white !border-transparent dark:!bg-white dark:hover:!bg-gray-200 dark:!text-black transition-colors"
                >
                    Ajouter un admin
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table className="mt-4">
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
                                <TableCell className="text-gray-600 dark:text-gray-400">
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
        </Card>
    );
};

export default AdminList;