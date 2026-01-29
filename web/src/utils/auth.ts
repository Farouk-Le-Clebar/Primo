import { store } from "../store/store";
import { setUser, clearUser } from "../store/userSlice";
import { verifyToken } from "../requests/AuthRequests";

export const logout = () => {
  localStorage.removeItem("token");
  store.dispatch(clearUser());
  window.location.reload();
};

export const checkAuth = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    store.dispatch(clearUser());
    return false;
  }

  try {
    const userData = await verifyToken(token);
    
    store.dispatch(setUser(userData));
    return true;
  } catch (error) {
    console.error("Session expirée ou invalide :", error);
    localStorage.removeItem("token");
    store.dispatch(clearUser());
    return false;
  }
};