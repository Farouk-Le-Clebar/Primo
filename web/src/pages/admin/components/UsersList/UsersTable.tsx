import { Trash2 } from "lucide-react";
import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
} from "@tremor/react";

// COMPONENTS
import type { UserType } from "../../../../types/admin";

type UsersTableProps = {
    users: UserType[];
    isWorking: boolean;
    isDeletePending: boolean;
    onDelete: (userId: string) => void;
};

const UsersTable = ({ users, isWorking, isDeletePending, onDelete }: UsersTableProps) => {
    return (
        <div className="overflow-x-auto">
            <Table className="mt-4">
                <TableHead>
                    <TableRow className="border-b border-gray-200 dark:border-white/5">
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Nom complet</TableHeaderCell>
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Email</TableHeaderCell>
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Dernière connexion</TableHeaderCell>
                        <TableHeaderCell className="text-right text-gray-500 dark:text-gray-400">Actions</TableHeaderCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                            <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                                {user.firstName} {user.surName}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                                {user.email}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                                {user.lastConnection 
                                    ? new Date(user.lastConnection).toLocaleDateString('fr-FR', { 
                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                      }) 
                                    : "Jamais"}
                            </TableCell>
                            
                            <TableCell className="text-right">
                                <button
                                    onClick={() => {
                                        if(window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                                            onDelete(user.id);
                                        }
                                    }}
                                    disabled={isDeletePending}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Supprimer l'utilisateur"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {users.length === 0 && !isWorking && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                    Aucun utilisateur trouvé.
                </div>
            )}
        </div>
    );
};

export default UsersTable;