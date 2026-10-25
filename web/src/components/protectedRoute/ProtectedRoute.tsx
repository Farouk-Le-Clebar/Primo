import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

// COMPONENTS
import { checkAuth } from "../../utils/auth";
import PrimoSplash from "../animations/PrimoSplash";

export default function ProtectedRoute() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const response = await checkAuth();

      if (!response.connected) {
        toast.error(response.message, {
          id: "auth-error",
        });
      }

      setIsAuth(response.connected);
    };

    verify();
  }, []);

  if (isAuth === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <PrimoSplash />
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/auth" replace />;
}