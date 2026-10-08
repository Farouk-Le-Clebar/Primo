import { Badge } from "@tremor/react";
import type { ReactNode } from "react";

export default function AutorisationBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "cancelled" | "works";
}) {
  return (
    <Badge className={`autorisations-badge autorisations-badge-${tone}`}>
      {children}
    </Badge>
  );
}
