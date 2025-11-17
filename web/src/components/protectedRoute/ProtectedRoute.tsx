import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../../requests/AuthRequests";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      try {
        const res = await verifyToken(token);
        if (!res.valid) {
          navigate("/auth", { replace: true });
          return;
        }
      } catch {
        navigate("/auth", { replace: true });
        return;
      }

      setChecked(true);
    };

    check();
  }, [navigate]);

  if (!checked) return null;

  return <>{children}</>;
}
