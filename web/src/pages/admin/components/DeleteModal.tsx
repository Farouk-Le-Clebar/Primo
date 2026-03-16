import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../../requests/admin";
import toast from 'react-hot-toast';

type DeleteModalProps = {
    userId: string;
    email: string;
    onClose: () => void;
};

const DeleteModal = ({ userId, email, onClose }: DeleteModalProps) => {
    const queryClient = useQueryClient();

    const {mutate: deleteMutation} = useMutation({
        mutationFn: () => deleteUser(userId),
        onSuccess: () => {
            toast.success("Utilisateur supprimé avec succès !", {
                id: "delete-success",
            });
            queryClient.invalidateQueries({ queryKey: ["users", "from", "to"] });
            onClose();
        },
        onError: () => {
            toast.error("Erreur lors de la suppression de l'utilisateur", {
                id: "delete-error",
            });
            console.error("Error deleting user");
        }
    })

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-lg font-UberMoveBold text-gray-800 mb-4">Confirmer la suppression</h2>
                <p className="text-sm text-gray-600 mb-6">Voulez-vous vraiment supprimer {email} ?</p>
                <div className="flex justify-end gap-4">
                    <button className="cursor-pointer px-4 py-2 text-sm font-UberMoveBold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all" onClick={onClose}>
                        Annuler
                    </button>
                    <button className="cursor-pointer px-4 py-2 text-sm font-UberMoveBold text-white bg-red-700 rounded-lg hover:bg-red-700 transition-all" onClick={() => deleteMutation()}>
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;