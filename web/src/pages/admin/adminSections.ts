import { BarChart3, MessageSquareText, ShieldCheck, Users } from "lucide-react";

export type AdminSectionPath = "overview" | "users" | "admins" | "feedbacks";

export type AdminSection = {
  path: AdminSectionPath;
  label: string;
  description: string;
  icon: typeof Users;
  tourId: string;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  { path: "overview", label: "Aperçu", description: "Une vue d'ensemble de votre communauté.", icon: BarChart3, tourId: "admin-overview-tour" },
  { path: "users", label: "Utilisateurs", description: "Gérez les membres inscrits sur la plateforme.", icon: Users, tourId: "admin-users-tour" },
  { path: "admins", label: "Administrateurs", description: "Gérez les membres ayant un accès complet au système.", icon: ShieldCheck, tourId: "admin-admins-tour" },
  { path: "feedbacks", label: "Retours & suggestions", description: "Consultez et gérez les retours laissés par vos utilisateurs.", icon: MessageSquareText, tourId: "admin-feedbacks-tour" },
];

export const findAdminSection = (pathname: string): AdminSection =>
  ADMIN_SECTIONS.find((section) => pathname.split("/")[2] === section.path) ?? ADMIN_SECTIONS[0];
