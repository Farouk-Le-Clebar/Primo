type RecentWork = {
  projectId: string;
  page: "dashboard" | "plots" | "members";
};

function storageKey() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.id ? `primo:recent-work:${user.id}` : null;
}

export function rememberProjectPage(pathname: string) {
  try {
    const match = pathname.match(
      /^\/projects\/([^/]+)\/(dashboard|plots|members)$/,
    );
    const key = storageKey();
    if (match && key)
      localStorage.setItem(
        key,
        JSON.stringify({ projectId: match[1], page: match[2] }),
      );
  } catch {
    /* Navigation remains available when browser storage is disabled. */
  }
}

export function getRecentWork(): RecentWork | null {
  try {
    const key = storageKey();
    const value = key ? JSON.parse(localStorage.getItem(key) || "null") : null;
    return typeof value?.projectId === "string" &&
      ["dashboard", "plots", "members"].includes(value.page)
      ? value
      : null;
  } catch {
    return null;
  }
}
