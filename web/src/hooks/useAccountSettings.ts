import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changeMapPreference } from "../requests/UserRequests";
import { sendResetPasswordEmail } from "../requests/mail";
import { mergeStoredUser, readStoredUser } from "./useStoredUser";

export type MapPreference = "basic" | "satellite";

export function useAccountSettings() {
  const email = readStoredUser().email ?? "";
  const [mapPreference, setMapPreference] = useState<MapPreference>(
    readStoredUser().mapPreference === "satellite" ? "satellite" : "basic",
  );

  const mapMutation = useMutation({
    mutationFn: (preference: MapPreference) => changeMapPreference(preference),
    onMutate: (preference) => {
      const previous = mapPreference;
      setMapPreference(preference);
      return { previous };
    },
    onSuccess: (_, preference) => {
      mergeStoredUser({ mapPreference: preference });
    },
    onError: (_, __, context) => {
      if (context) setMapPreference(context.previous);
      toast.error("Impossible de changer le fond de carte.");
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => sendResetPasswordEmail(email),
    onError: () => {
      toast.error("L'envoi du lien a échoué. Réessayez plus tard.");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return {
    email,
    mapPreference,
    changeMap: (preference: MapPreference) => mapMutation.mutate(preference),
    sendResetLink: () => resetMutation.mutate(),
    isResetPending: resetMutation.isPending,
    isResetSent: resetMutation.isSuccess,
    logout,
  };
}
