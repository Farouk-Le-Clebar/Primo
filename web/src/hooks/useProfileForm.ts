import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUserProfile } from "../requests/UserRequests";
import { DEFAULT_AVATAR } from "../components/avatar/Avatar";
import { mergeStoredUser, readStoredUser } from "./useStoredUser";

export type ProfileDraft = {
  firstName: string;
  surName: string;
  profilePicture: string;
};

const readDraft = (): ProfileDraft => {
  const user = readStoredUser();
  return {
    firstName: user.firstName ?? "",
    surName: user.surName ?? "",
    profilePicture: user.profilePicture || DEFAULT_AVATAR,
  };
};

export function useProfileForm() {
  const [saved, setSaved] = useState<ProfileDraft>(readDraft);
  const [draft, setDraft] = useState<ProfileDraft>(saved);

  const isDirty = draft.firstName !== saved.firstName || draft.surName !== saved.surName || draft.profilePicture !== saved.profilePicture;

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ProfileDraft) => updateUserProfile(localStorage.getItem("token") || "", payload),
    onSuccess: (_, payload) => {
      mergeStoredUser(payload);
      setSaved(payload);
      toast.success("Profil mis à jour.");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du profil.");
    },
  });

  const updateField = <Key extends keyof ProfileDraft>(key: Key, value: ProfileDraft[Key]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = () => {
    if (!isDirty || isPending) return;
    mutate({ ...draft, firstName: draft.firstName.trim(), surName: draft.surName.trim() });
  };

  const discard = () => setDraft(saved);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "s" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      save();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return { draft, updateField, isDirty, isPending, save, discard };
}
