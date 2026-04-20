import { useMutation } from "@tanstack/react-query";
import SuccessIcon from "../../assets/icons/success.svg?react";
import Spinner from "../../ui/Spinner";
import { X } from "lucide-react";
import { sendResetPasswordEmail } from "../../requests/mail";
import { useState } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const SendEmailResetPassword = () => {
    const [email, setEmail] = useState("");

    const { mutate: sendEmailResetPassword, isPending, isSuccess, isError } = useMutation({
        mutationFn: () => sendResetPasswordEmail(email),
    });

    const isForm = !isPending && !isSuccess && !isError;


    return (
        <div className="flex flex-1 w-full items-center justify-center font-UberMove">
            <div className="flex flex-col items-center gap-10 w-full px-4">

                {isForm && (
                    <div className="flex flex-col gap-4 w-full">
                        <p className="text-center font-semibold text-xl mb-2">Mot de passe oublié ?</p>
                        <Input
                            type="email"
                            placeholder="Adresse e-mail"
                            value={email}
                            onChange={setEmail}
                            className="pr-10"
                        />
                        <Button
                            onClick={sendEmailResetPassword}
                            textSize="font-inter font-medium text-base"
                            backgroundColor="bg-black"
                            backgroundHoverColor="hover:bg-gray-800"
                            className="w-full"
                        >
                            Envoyer un email de réinitialisation
                        </Button>
                    </div>
                )}

                {isPending && (
                    <>
                        <Spinner />
                        <p className="text-center text-gray-600">
                            Envoi de l'e-mail de réinitialisation en cours...
                        </p>
                    </>
                )}

                {isSuccess && (
                    <>
                        <SuccessIcon className="w-20" />
                        <p className="text-center">Si l'adresse e-mail fournie est reliée à un compte, vous recevrez un e-mail de réinitialisation.</p>
                        <p className="text-center text-gray-500 text-sm">Vous pouvez fermer cette page.</p>
                    </>
                )}

                {isError && (
                    <>
                        <X className="w-20 h-20 text-red-500" />
                        <p className="text-center">
                            <span className="font-semibold">
                                Une erreur est survenue, merci de réessayer plus tard.
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default SendEmailResetPassword;