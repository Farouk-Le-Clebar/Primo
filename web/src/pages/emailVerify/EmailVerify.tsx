import { useSearchParams } from "react-router-dom";
import SuccessIcon from "../../assets/icons/success.svg?react";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "../../requests/mail";
import Spinner from "../../ui/Spinner";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg?react";
import { ExternalLink, X } from "lucide-react";

const EmailVerify = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { isSuccess, isError, isLoading, error, data } = useQuery({
        queryKey: [],
        queryFn: () => verifyEmail(token!),
        enabled: !!token,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-background">
            <div className="w-full h-20 bg-white flex items-center justify-center border-b border-gray-200">
                <div className="flex flex-row items-center justify-center gap-2">
                    <LogoPrimo className="h-10 w-10" />
                    <p className="font-UberMove font-medium text-3xl text-black">Primo</p>
                </div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center font-UberMove">
                <div className="flex flex-col items-center gap-10">
                    {isLoading &&
                        <>
                            <Spinner />
                            <p>Merci de patienter, nous vérifions votre adresse e-mail...</p>
                        </>
                    }
                    {isSuccess &&
                        <>
                            <SuccessIcon className="w-20" />
                            <p className="text-center">Votre adresse e-mail <span className="font-semibold">{data?.email}</span> a été vérifiée avec succès !</p>
                            <button className="flex flex-row items-center justify-center cursor-pointer bg-black font-semibold text-white py-2 px-4 rounded-md hover:bg-black/80 transition-colors" onClick={() => window.location.href = "https://app.primo-data.fr/auth"}>
                                <ExternalLink className="w-5 h-5 inline-block mr-2" />
                                <p>Aller sur Primo</p>
                            </button>
                        </>
                    }
                    {isError &&
                        <>
                            <X className="w-20 h-20 text-red-500" />
                            <p className="text-center">Echec de la vérification : <span className="font-semibold">{error.message}</span></p>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default EmailVerify;