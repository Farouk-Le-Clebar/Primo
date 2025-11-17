import { store } from "../store/store";
import { clearUser } from "../store/userSlice";

export const logout = () => {
  localStorage.removeItem("token");
  store.dispatch(clearUser());
  window.location.reload();
};
