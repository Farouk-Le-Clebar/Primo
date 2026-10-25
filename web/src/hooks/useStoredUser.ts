export type StoredUser = {
  id?: string;
  email?: string;
  firstName?: string;
  surName?: string;
  profilePicture?: string | null;
  mapPreference?: string;
  isAdmin?: boolean;
};

export function readStoredUser(): StoredUser {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function mergeStoredUser(changes: StoredUser): StoredUser {
  const user = { ...readStoredUser(), ...changes };
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}
