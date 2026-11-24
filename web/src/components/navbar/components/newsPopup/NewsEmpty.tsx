import { BellOff } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";

export default function NewsEmpty() {
  return <EmptyState icon={BellOff} title="Rien de neuf pour l’instant" description="Les ajouts de parcelles, notes, documents et membres de vos projets apparaîtront ici." framed={false} />;
}
