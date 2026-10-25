export const ROUTES = {
  map: "/",
  dashboard: "/dashboard",
  projects: "/projects",
  project: (projectId: string) => `/projects/${projectId}`,
  admin: "/admin",
  adminSection: (section: string) => `/admin/${section}`,
  adminUser: (userId: string) => `/admin/users/${userId}`,
  profile: "/profile",
  feedback: "/feedback",
  onboarding: "/onboarding",
} as const;

export const LEGACY_MAP_PREFIX = "/search";
