import SuccessIcon from "../../assets/icons/success.svg?react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

const PostRegisterEmailVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    return (
        <div className="animate-fade-in-up flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-center space-y-6 w-full max-w-sm px-4">
                <SuccessIcon className="w-16 h-16" />
                
                <div className="text-center space-y-4">
                    <h2 className="font-ubermove font-medium text-2xl text-gray-900 dark:text-white transition-colors">
                        Compte créé avec succès !
                    </h2>
                    
                    <p className="font-inter text-sm text-gray-500 dark:text-gray-400 transition-colors leading-relaxed">
                        Un e-mail de confirmation a été envoyé à l'adresse<br />
                        <span className="font-medium text-black dark:text-white">{data?.email || "votre e-mail"}</span>.
                    </p>
                    
                    <div className="p-3 bg-gray-50 dark:bg-[#171717] border border-gray-100 dark:border-[#262626] rounded-lg transition-colors">
                        <p className="font-inter text-sm text-gray-600 dark:text-gray-300 transition-colors">
                            Vous devez valider votre adresse e-mail pour pouvoir accéder à la plateforme Primo.
                        </p>
                    </div>
                </div>

                <div className="w-full pt-4">
                    <Button
                        onClick={() => navigate("/auth")}
                        backgroundColor="bg-black dark:bg-white"
                        backgroundHoverColor="hover:bg-gray-800 dark:hover:bg-white/80"
                        textColor="text-white dark:text-black"
                        className="w-full transition-colors cursor-pointer"
                    >
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PostRegisterEmailVerify;