import { BugAntIcon, EllipsisHorizontalIcon, LightBulbIcon, SparklesIcon } from "@heroicons/react/20/solid";
import type { ComponentType, SVGProps } from "react";

export type FeedbackCategoryId = "bug" | "idea" | "improvement" | "other";

export type FeedbackCategory = {
  id: FeedbackCategoryId;
  label: string;
  placeholder: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  { id: "bug", label: "Bug", placeholder: "Ex : La carte ne charge plus les parcelles", icon: BugAntIcon },
  { id: "idea", label: "Idée", placeholder: "Ex : Exporter un projet en PDF", icon: LightBulbIcon },
  { id: "improvement", label: "Amélioration", placeholder: "Ex : Recherche d'adresse plus rapide", icon: SparklesIcon },
  { id: "other", label: "Autre", placeholder: "Ex : Une question sur mon abonnement", icon: EllipsisHorizontalIcon },
];
