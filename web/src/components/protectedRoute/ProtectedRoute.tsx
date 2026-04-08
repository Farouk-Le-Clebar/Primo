import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

// COMPONENTS
import { checkAuth } from "../../utils/auth";

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const isConnected = await checkAuth();

      if (!isConnected) {
        toast.error("Veuillez vous connecter pour accéder à cette page", {
          id: "auth-error",
        });
      }

      setIsAuth(isConnected);
    };

    verify();
  }, []);

  if (isAuth === null) {
    return <div className="h-screen w-full bg-white"></div>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
}