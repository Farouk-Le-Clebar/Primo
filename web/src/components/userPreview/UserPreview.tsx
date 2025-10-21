import { useQuery } from "@tanstack/react-query";
import { getUserByMail } from "../../requests/UserRequests";
import profilePlaceholder from "../../assets/images/profile.svg";

export default function UserInfo({ email }: { email: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", email],
    queryFn: () => getUserByMail(email),
    enabled: !!email,
  });

  if (!email) return <p className="text-gray-500">Veuillez entrer un email.</p>;
  if (isLoading) return <p>Chargement des informations...</p>;
  if (error) return <p className="text-red-500">Erreur lors de la récupération.</p>;
  if (!data) return <p>Aucun utilisateur trouvé.</p>;

  const profileImage = data.profilePicture || profilePlaceholder;

  return (
    <div className="flex bg-gray-100 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500">
        <div>
            <img
            src={profileImage}
            alt="Photo de profil"
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
        </div>
        <div>
            <div className="flex gap-1.5 ml-3 font-semibold">
                <p className="text-sm">{data.firstName || "Prénom"}</p>
                <p className="text-sm">{data.surName || "Nom de famille"}</p>
            </div>
            <p className="ml-3">{data.email}</p>
        </div>
    </div>
  );
}
