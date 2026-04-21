import { verifyToken } from "../requests/AuthRequests";

export const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

export const checkAuth = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { connected: false, message: "Veuillez vous connecter pour accéder à cette page." };
  }

  try {
    const user = await verifyToken(token);
    if (!user.verified) {
      localStorage.removeItem("token");
      return { connected: false, message: "Votre compte n'est pas vérifié." };
    }
    localStorage.setItem("user", JSON.stringify(user));
    return { connected: true, message: "Vous êtes connecté." };
  } catch (error) {
    console.error("Session expirée ou invalide :", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { connected: false, message: "Session expirée ou invalide. Veuillez vous reconnecter." };
  }
};

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
}
