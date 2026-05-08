import { Trash2 } from "lucide-react";
import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
} from "@tremor/react";

type FeedbacksTableProps = {
    feedbacks: any[];
    isWorking: boolean;
    isDeletePending: boolean;
    onDelete: (id: string) => void;
};

const FeedbacksTable = ({ feedbacks, isWorking, isDeletePending, onDelete }: FeedbacksTableProps) => {
    return (
        <div className="overflow-x-auto">
            <Table className="mt-4">
                <TableHead>
                    <TableRow className="border-b border-gray-200 dark:border-white/5">
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Date</TableHeaderCell>
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Auteur</TableHeaderCell>
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Sujet</TableHeaderCell>
                        <TableHeaderCell className="text-gray-500 dark:text-gray-400">Message</TableHeaderCell>
                        <TableHeaderCell className="text-right text-gray-500 dark:text-gray-400">Actions</TableHeaderCell>
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {feedbacks.map((feedback) => (
                        <TableRow key={feedback.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                            <TableCell className="text-gray-600 dark:text-gray-400 text-xs">
                                {new Date(feedback.createdAt).toLocaleDateString('fr-FR', { 
                                    day: '2-digit', month: 'short', year: 'numeric' 
                                })}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                                {feedback.user ? (
                                    <div className="flex flex-col">
                                        <span>{feedback.user.firstName} {feedback.user.surName}</span>
                                        <span className="text-xs text-gray-400 font-normal">{feedback.user.email}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 italic text-xs">Utilisateur supprimé</span>
                                )}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-200 font-medium">
                                {feedback.title}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate" title={feedback.description}>
                                {feedback.description}
                            </TableCell>
                            
                            <TableCell className="text-right">
                                <button
                                    onClick={() => {
                                        if(window.confirm("Êtes-vous sûr de vouloir supprimer ce retour ?")) {
                                            onDelete(feedback.id);
                                        }
                                    }}
                                    disabled={isDeletePending}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Supprimer le feedback"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {feedbacks.length === 0 && !isWorking && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                    Aucun retour utilisateur trouvé.
                </div>
            )}
        </div>
    );
};

export default FeedbacksTable;