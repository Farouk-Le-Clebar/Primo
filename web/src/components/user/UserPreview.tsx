import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import { getUserByMail } from "../../requests/UserRequests";

// ASSETS
import { getAvatarComponent } from "../avatar/Avatar";

export default function UserPreview({ email }: { email: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["user", email],
        queryFn: () => getUserByMail(email),
        enabled: !!email,
    });

    if (!email) return null;

    if (isLoading) {
        return (
            <div className="flex bg-[#EFEFF4] dark:bg-[#171717] w-full px-4 py-3 border border-gray-200 dark:border-[#262626] rounded-xl animate-pulse transition-colors">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700/50 rounded-full" />
                <div className="ml-3 flex-1 space-y-2 py-1">
                    <div className="h-3.5 bg-gray-300 dark:bg-gray-700/50 rounded w-1/2" />
                    <div className="h-2.5 bg-gray-300 dark:bg-gray-700/50 rounded w-1/3" />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="px-4 py-3 border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl text-red-600 dark:text-red-400 text-sm transition-colors">
                Utilisateur introuvable ou erreur de chargement.
            </div>
        );
    }

    const isGoogleAvatar = data.profilePicture?.startsWith("http");
    const AvatarComponent = !isGoogleAvatar ? (getAvatarComponent(data.profilePicture)) : null;

    return (
        <div className="flex items-center bg-[#EFEFF4] dark:bg-[#171717] w-full px-4 py-3 border border-transparent dark:border-[#262626] rounded-xl transition-colors duration-200">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm flex-shrink-0 bg-white dark:bg-black">
                {isGoogleAvatar ? (
                    <img src={data.profilePicture} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    AvatarComponent && <AvatarComponent className="w-full h-full" />
                )}
            </div>

            <div className="ml-3 flex flex-col min-w-0">
                <div className="flex gap-1.5 font-semibold text-gray-900 dark:text-white leading-tight">
                    <p className="text-sm truncate">
                        {data.firstName || "Prénom"}
                    </p>
                    <p className="text-sm truncate">{data.surName || "Nom"}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {data.email}
                </p>
            </div>
        </div>
    );
}
