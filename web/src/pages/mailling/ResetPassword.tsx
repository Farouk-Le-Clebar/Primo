import { useSearchParams } from "react-router-dom";
import SuccessIcon from "../../assets/icons/success.svg?react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isValidRequestResetPassword, resetPassword } from "../../requests/mail";
import Spinner from "../../ui/Spinner";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg?react";
import { ExternalLink, X } from "lucide-react";
import { useState } from "react";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const token = searchParams.get("token");

    const {
        isLoading: isCheckingToken,
        isSuccess: isTokenValid,
        isError: isTokenInvalid,
        error: tokenError
    } = useQuery({
        queryKey: ["verify", "valid", "request"],
        queryFn: () => isValidRequestResetPassword(token!),
        enabled: !!token,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    const {
        mutate: resetPasswordMutation,
        isPending: isSubmitting,
        isSuccess: isSubmitSuccess,
        isError: isSubmitError,
        error: submitError,
        reset: resetMutation
    } = useMutation({
        mutationFn: () => resetPassword(token!, newPassword),
        onSuccess: () => {
            setNewPassword("");
            setRepeatPassword("");
        },
    });

    const handleResetPassword = () => {
        setLocalError("");
        if (newPassword !== repeatPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!newPassword) {
            setLocalError("Veuillez entrer un mot de passe.");
            return;
        }
        resetPasswordMutation();
    };

    const showForm = isTokenValid && !isSubmitting && !isSubmitSuccess && !isSubmitError;

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-background">
            <div className="w-full h-20 bg-white flex items-center justify-center border-b border-gray-200">
                <div className="flex flex-row items-center justify-center gap-2">
                    <LogoPrimo className="h-10 w-10" />
                    <p className="font-UberMove font-medium text-3xl text-black">Primo</p>
                </div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center font-UberMove">
                <div className="flex flex-col items-center gap-10 w-full max-w-sm px-4">

                    {(isCheckingToken || isSubmitting) && (
                        <>
                            <Spinner />
                            <p className="text-center text-gray-600">
                                {isCheckingToken ? "Vérification du lien sécurisé..." : "Mise à jour de votre mot de passe..."}
                            </p>
                        </>
                    )}

                    {showForm && (
                        <div className="flex flex-col gap-4 w-full">
                            <p className="text-center font-semibold text-xl mb-2">Réinitialisation du mot de passe</p>
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <input
                                type="password"
                                placeholder="Répétez le nouveau mot de passe"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {localError && (
                                <p className="text-red-500 text-sm text-center font-medium">{localError}</p>
                            )}
                            <button
                                onClick={handleResetPassword}
                                className="flex flex-row items-center justify-center cursor-pointer bg-black font-semibold text-white py-3 px-4 rounded-md hover:bg-black/80 transition-colors w-full mt-2"
                            >
                                Réinitialiser le mot de passe
                            </button>
                        </div>
                    )}

                    {isSubmitSuccess && (
                        <>
                            <SuccessIcon className="w-20" />
                            <p className="text-center">Votre mot de passe a été réinitialisé avec succès !</p>
                            <button
                                className="flex flex-row items-center justify-center cursor-pointer bg-black font-semibold text-white py-2 px-4 rounded-md hover:bg-black/80 transition-colors"
                                onClick={() => window.location.href = "https://app.primo-data.fr/auth"}
                            >
                                <ExternalLink className="w-5 h-5 inline-block mr-2" />
                                <p>Aller sur Primo</p>
                            </button>
                        </>
                    )}

                    {(isTokenInvalid || isSubmitError) && (
                        <>
                            <X className="w-20 h-20 text-red-500" />
                            <p className="text-center">
                                <span className="font-semibold">
                                    {(submitError as any)?.message || (tokenError as any)?.message || "Une erreur est survenue, le lien est peut-être expiré."}
                                </span>
                            </p>
                            {isSubmitError && (
                                <button
                                    className="flex flex-row items-center justify-center cursor-pointer bg-gray-200 font-semibold text-black py-2 px-4 rounded-md hover:bg-gray-300 transition-colors mt-4"
                                    onClick={() => resetMutation()}
                                >
                                    <p>Réessayer</p>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;