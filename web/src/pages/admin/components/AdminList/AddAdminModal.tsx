import { useState } from "react";
import Input from "../../../../ui/Input";
import { addAdminPermission } from "../../../../requests/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddAdminModalProps = {
    onClose: () => void;
}

const AddAdminModal = ({ onClose }: AddAdminModalProps) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const queryClient = useQueryClient();

    const {mutate: promoteToAdmin} = useMutation({
        mutationFn: () => addAdminPermission(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "get", "admins"] });
            onClose();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "Une erreur est survenue");
            console.error("Error promoting user to admin", err);
        }
    });


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">

                <div className="mb-6">
                    <h2 className="text-xl font-UberMoveBold text-gray-900 mb-4">Ajouter un Administrateur</h2>

                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <p className="text-sm leading-relaxed">
                            <span className="font-semibold block mb-0.5">Attention aux privilèges</span>
                            Cette action donnera à l'utilisateur un accès complet aux paramètres du système.
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse e-mail du futur administrateur
                    </label>
                    <Input
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="Ex: collaborateur@primo-data.fr"
                        width="w-full"
                    />
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        disabled={!email}
                        className={`px-5 py-2 text-sm font-UberMoveBold text-white rounded-lg transition-all shadow-sm
                            ${email ? 'bg-gray-900 hover:bg-black cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}
                        `}
                        onClick={() => promoteToAdmin()}
                    >
                        Promouvoir
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AddAdminModal;