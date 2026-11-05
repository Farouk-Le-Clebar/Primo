import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ExternalLink, UserPlus, X } from "lucide-react";
import { getProjectInvitation, respondToProjectInvitation } from "../../requests/mail";
import Spinner from "../../ui/Spinner";
import SuccessIcon from "../../assets/icons/success.svg?react";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg?react";

const ProjectInvitation = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const decline = searchParams.get("decline") === "true";

    const { isLoading, isError, error, data: invitation } = useQuery({
        queryKey: ["project-invitation", token],
        queryFn: () => getProjectInvitation(token!),
        enabled: !!token,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    const { mutate: respond, isPending, isSuccess, isError: isRespondError, error: respondError, data: response } = useMutation({
        mutationFn: (accept: boolean) => respondToProjectInvitation(token!, accept),
    });

    const goToPrimo = () => {
        window.location.href = "https://app.primo-data.fr/auth";
    };

    const errorMessage = !token
        ? "Lien d'invitation invalide."
        : isError
            ? error.message
            : isRespondError
                ? respondError.message
                : null;

    const answered = isSuccess && response;

    const acceptButton = (
        <button
            className={`flex flex-row items-center justify-center gap-2 cursor-pointer font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 ${decline ? "bg-gray-100 text-black hover:bg-gray-200" : "bg-black text-white hover:bg-black/80"}`}
            onClick={() => respond(true)}
            disabled={isPending}
        >
            <Check className="w-5 h-5" />
            Accepter
        </button>
    );

    const declineButton = (
        <button
            className={`flex flex-row items-center justify-center gap-2 cursor-pointer font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 ${decline ? "bg-black text-white hover:bg-black/80" : "bg-gray-100 text-black hover:bg-gray-200"}`}
            onClick={() => respond(false)}
            disabled={isPending}
        >
            <X className="w-5 h-5" />
            Refuser
        </button>
    );

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-background">
            <div className="w-full h-20 bg-white flex items-center justify-center border-b border-gray-200">
                <div className="flex flex-row items-center justify-center gap-2">
                    <LogoPrimo className="h-10 w-10" />
                    <p className="font-UberMove font-medium text-3xl text-black">Primo</p>
                </div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center font-UberMove px-4">
                <div className="flex flex-col items-center gap-10">
                    {token && isLoading &&
                        <>
                            <Spinner />
                            <p>Merci de patienter, nous vérifions votre invitation...</p>
                        </>
                    }
                    {invitation && !answered &&
                        <>
                            <UserPlus className="w-20 h-20" />
                            <p className="text-center">
                                <span className="font-semibold">{invitation.inviterName ?? "Quelqu'un"}</span> vous invite à rejoindre le projet <span className="font-semibold">{invitation.projectName}</span>.
                            </p>
                            {isPending
                                ? <Spinner />
                                : <div className="flex flex-row items-center gap-3">
                                    {decline ? <>{declineButton}{acceptButton}</> : <>{acceptButton}{declineButton}</>}
                                </div>
                            }
                        </>
                    }
                    {answered && response.accepted &&
                        <>
                            <SuccessIcon className="w-20" />
                            <p className="text-center">Vous avez rejoint le projet <span className="font-semibold">{response.projectName}</span> !</p>
                            <button className="flex flex-row items-center justify-center cursor-pointer bg-black font-semibold text-white py-2 px-4 rounded-md hover:bg-black/80 transition-colors" onClick={goToPrimo}>
                                <ExternalLink className="w-5 h-5 inline-block mr-2" />
                                <p>Aller sur Primo</p>
                            </button>
                        </>
                    }
                    {answered && !response.accepted &&
                        <>
                            <X className="w-20 h-20 text-gray-500" />
                            <p className="text-center">Vous avez refusé l'invitation au projet <span className="font-semibold">{response.projectName}</span>.</p>
                        </>
                    }
                    {errorMessage &&
                        <>
                            <X className="w-20 h-20 text-red-500" />
                            <p className="text-center">Impossible de traiter l'invitation : <span className="font-semibold">{errorMessage}</span></p>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProjectInvitation;
