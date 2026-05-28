import { useMutation } from "@tanstack/react-query";
import SuccessIcon from "../../assets/icons/success.svg?react";
import Spinner from "../../ui/Spinner";
import { X } from "lucide-react";
import { sendResetPasswordEmail } from "../../requests/mail";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const SendEmailResetPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const { mutate: sendEmailResetPassword, isPending, isSuccess, isError, reset } = useMutation({
        mutationFn: () => sendResetPasswordEmail(email),
    });

    const isForm = !isPending && !isSuccess && !isError;

    const handleSubmit = () => {
        if (email) sendEmailResetPassword();
    };

    return (
        <div className="animate-fade-in-up w-full">
            {isForm && (
                <div className="flex flex-col space-y-6">
                    <div className="text-center space-y-2 mb-2">
                        <h2 className="font-inter font-medium text-2xl text-gray-900 dark:text-white transition-colors">
                            Mot de passe oublié ?
                        </h2>
                        <p className="font-inter text-sm text-gray-500 dark:text-gray-400 transition-colors">
                            Renseignez votre adresse e-mail pour recevoir un lien sécurisé permettant de réinitialiser votre mot de passe.
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-inter font-medium text-sm text-gray-800 dark:text-white transition-colors">
                            Adresse e-mail
                        </h3>
                        <Input
                            type="email"
                            placeholder="Ex: jean.dupont@mail.com"
                            value={email}
                            onChange={setEmail}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit();
                            }}
                            focusColor="focus:outline-none dark:focus:border-white/20"
                            className="dark:bg-[#171717] dark:border-[#262626] dark:text-white dark:placeholder-gray-500 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={!email}
                            textSize="font-inter font-medium text-base dark:text-black dark:hover:text-black"
                            backgroundColor="bg-black dark:bg-white"
                            backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
                            className="w-full transition-colors"
                        >
                            Envoyer le lien
                        </Button>

                        <Button
                            onClick={() => navigate("/auth")}
                            height="h-7"
                            textSize="font-inter font-medium text-base"
                            backgroundColor="bg-transparent dark:bg-transparent"
                            backgroundHoverColor="hover:bg-transparent dark:hover:bg-transparent"
                            textColor="text-black dark:text-gray-300"
                            textHoverColor="hover:text-black dark:hover:text-white"
                            shadowHover="hover:shadow-none dark:hover:shadow-none"
                            className="w-full hover:underline hover:underline-offset-4 disabled:bg-transparent transition-colors"
                        >
                            Retour à la connexion
                        </Button>
                    </div>
                </div>
            )}

            {isPending && (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <Spinner />
                    <p className="font-inter text-center text-gray-600 dark:text-gray-400 transition-colors">
                        Envoi du lien sécurisé en cours...
                    </p>
                </div>
            )}

            {isSuccess && (
                <div className="flex flex-col items-center justify-center space-y-5 py-4">
                    <SuccessIcon className="w-16 h-16" />
                    <div className="text-center space-y-2">
                        <h3 className="font-inter font-medium text-lg text-black dark:text-white transition-colors">
                            E-mail envoyé avec succès !
                        </h3>
                        <p className="font-inter text-sm text-gray-500 dark:text-gray-400 transition-colors max-w-sm">
                            Si cette adresse est liée à un compte, vous recevrez vos instructions de réinitialisation d'ici quelques instants.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/auth")}
                        backgroundColor="bg-gray-100 dark:bg-[#171717]"
                        backgroundHoverColor="hover:bg-gray-200 dark:hover:bg-[#262626]"
                        textColor="text-black dark:text-white"
                        className="w-full mt-4 border-transparent dark:border-[#262626] transition-colors"
                    >
                        Retourner à l'accueil
                    </Button>
                </div>
            )}

            {isError && (
                <div className="flex flex-col items-center justify-center space-y-5 py-4">
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-full">
                        <X className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="font-inter font-medium text-lg text-black dark:text-white transition-colors">
                            Échec de l'envoi
                        </h3>
                        <p className="font-inter text-sm text-gray-500 dark:text-gray-400 transition-colors">
                            Une erreur est survenue lors de l'envoi. Veuillez vérifier votre réseau ou réessayer plus tard.
                        </p>
                    </div>
                    <Button
                        onClick={() => reset()}
                        backgroundColor="bg-black dark:bg-white"
                        backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
                        textColor="text-white dark:text-black"
                        className="w-full mt-4 transition-colors"
                    >
                        Réessayer
                    </Button>
                </div>
            )}
        </div>
    );
}

export default SendEmailResetPassword;