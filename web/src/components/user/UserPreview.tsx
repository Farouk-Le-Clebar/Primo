import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import { getUserByMail } from "../../requests/UserRequests";

// ASSETS
import profilePlaceholder from "../../assets/profilePictures/green.png";

export default function UserInfo({ email }: { email: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", email],
    queryFn: () => getUserByMail(email),
    enabled: !!email,
  });

  const getAvatarUrl = (name: string | undefined) => {
    const fileName = name || "green.png";

    console.log("Profile picture file name:", data);
    if (fileName.startsWith("data:") || fileName.startsWith("http")) return fileName;
    
    try {
      return new URL(`../../assets/profilePictures/${fileName}`, import.meta.url).href;
    } catch (e) {
      return profilePlaceholder;
    }
  };

  if (!email) return null;

  if (isLoading) {
    return (
      <div className="flex bg-[#EFEFF4] w-full px-4 py-3 border border-gray-200 rounded-xl animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="ml-3 flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-3 bg-gray-300 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-3 border border-red-100 bg-red-50 rounded-xl text-red-600 text-sm">
        Utilisateur introuvable ou erreur de chargement.
      </div>
    );
  }

  return (
    <div className="flex items-center bg-[#EFEFF4] w-full px-4 py-3 border border-transparent rounded-xl transition-all duration-200">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0">
        <img
          src={getAvatarUrl(data.profilePicture)}
          alt="Photo de profil"
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = profilePlaceholder)}
        />
      </div>

      <div className="ml-3 flex flex-col min-w-0">
        <div className="flex gap-1.5 font-semibold text-gray-900 leading-tight">
          <p className="text-sm truncate">{data.firstName || "Prénom"}</p>
          <p className="text-sm truncate">{data.surName || "Nom"}</p>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{data.email}</p>
      </div>
    </div>
  );
}