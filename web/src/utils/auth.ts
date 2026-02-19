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
    const user = await verifyToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    return true;
  } catch (error) {
    console.error("Session expirée ou invalide :", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};

export function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`,
    };
}
