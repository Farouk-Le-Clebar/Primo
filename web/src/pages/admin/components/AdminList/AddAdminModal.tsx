import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, AlertTriangle } from "lucide-react";
import { Dialog, DialogPanel, TextInput, Button } from "@tremor/react";

// COMPONENTS
import { addAdminPermission } from "../../../../requests/admin";

type AddAdminModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const AddAdminModal = ({ isOpen, onClose }: AddAdminModalProps) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const queryClient = useQueryClient();

    const { mutate: promoteToAdmin, isPending } = useMutation({
        mutationFn: () => addAdminPermission(email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "get", "admins"] });
            setEmail(""); 
            setError("");
            onClose();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || "Une erreur est survenue");
            console.error("Error promoting user to admin", err);
        }
    });

    return (
        <Dialog open={isOpen} onClose={onClose} static={true} className="z-[100] ">
            <DialogPanel className="sm:max-w-md bg-white dark:bg-[#171717] border border-gray-100 dark:border-white/10 transition-colors ring-0 dark:ring-0">
                
                <div className="absolute right-0 top-0 pr-3 pt-3">
                    <button
                        type="button"
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" aria-hidden={true} />
                    </button>
                </div>
                
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if(email) promoteToAdmin();
                    }}
                >
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Ajouter un Administrateur
                    </h4>
                    
                    <div className="flex items-start gap-3 p-3 mb-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                        <p className="text-sm leading-relaxed">
                            <span className="font-semibold block mb-0.5">Attention aux privilèges</span>
                            Cette action donnera à l'utilisateur un accès complet aux paramètres du système.
                        </p>
                    </div>

                    <label
                        htmlFor="admin-email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Adresse e-mail du futur administrateur
                    </label>
                    <TextInput
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: collaborateur@primo-data.fr"
                        className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white border-trasnparent focus:border-transparent focus:ring-0"
                    />
                    {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="dark:border-white/10 dark:!text-white dark:hover:bg-white/5 text-green-700 hover:bg-green-50 hover:text-green-700 transition-colors border-green-700 hover:border-green-700"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={!email || isPending}
                            loading={isPending}
                            className="dark:bg-white dark:text-black dark:hover:bg-gray-200 border-transparent hover:border-transparent bg-green-700 hover:bg-green-600 hover:border-green-700 transition-colors"
                        >
                            Promouvoir
                        </Button>
                    </div>
                </form>
            </DialogPanel>
        </Dialog>
    );
}

export default AddAdminModal;