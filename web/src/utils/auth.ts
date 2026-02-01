import { verifyToken } from "../requests/AuthRequests";

export const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

export const checkAuth = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const userData = await verifyToken(token);
    return true;
  } catch (error) {
    console.error("Session expirée ou invalide :", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};