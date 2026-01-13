import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../../utils/auth"; // Importe ta fonction
import toast from "react-hot-toast";

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const isConnected = await checkAuth();
      
      if (!isConnected) {
        toast.error("Veuillez vous connecter pour accéder à cette page", {
          id: "auth-error", // Évite les doublons de toasts
        });
      }
      
      setIsAuth(isConnected);
    };

    verify();
  }, []);

  // Écran de chargement pour éviter le "flash" de la page d'accueil
  if (isAuth === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  // Si OK -> Affiche le contenu (Outlet), sinon -> Redirection Accueil
  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}