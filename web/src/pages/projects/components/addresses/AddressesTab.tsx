import { useState } from "react";
import { useParams } from "react-router-dom";
import { MapPinned, Plus } from "lucide-react";
import EmptyState from "../../../../ui/EmptyState";
import AddProjectAddressModal from "../../../../components/projectAddresses/AddProjectAddressModal";
import { useDeleteProjectAddress, useProjectAddresses } from "../../../../hooks/useProjectAddresses";
import type { AddressCategory } from "../../../../types/project/addresses";
import FilterChips, { type FilterChip } from "../ui/FilterChips";
import { useProjectPlots } from "../dashboard/useProjectData";
import AddressCard from "./AddressCard";
import { ADDRESS_CATEGORIES, ADDRESS_CATEGORY_ORDER } from "./addressMeta";

type AddressFilter = "all" | AddressCategory;

export default function AddressesTab() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filter, setFilter] = useState<AddressFilter>("all");
  const { data: addresses = [], isPending } = useProjectAddresses(projectId);
  const { data: plots = [] } = useProjectPlots(projectId);
  const { mutate: deleteAddress } = useDeleteProjectAddress(projectId);
  const categoryOf = (category: AddressCategory | null): AddressCategory => category ?? "autre";
  const chips: FilterChip<AddressFilter>[] = [
    { id: "all", label: "Toutes", count: addresses.length },
    ...ADDRESS_CATEGORY_ORDER.map((category) => ({
      id: category,
      label: ADDRESS_CATEGORIES[category].plural,
      count: addresses.filter((address) => categoryOf(address.category) === category).length,
      tone: ADDRESS_CATEGORIES[category].tone,
    })).filter((chip) => chip.count > 0),
  ];
  const visible = addresses.filter((address) => filter === "all" || categoryOf(address.category) === filter);

  if (isPending) return <div className="primo-card h-[300px] animate-pulse motion-reduce:animate-none" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full min-w-0 md:w-auto md:flex-1">
          <h3 className="text-[15px] font-bold text-[#1c1c1e] dark:text-[#fafafa]">Adresses du projet</h3>
          <p className="mt-0.5 text-xs text-[#82828c]">Visibles sur la carte et dans le détail des parcelles par tous les membres. Temps estimés depuis chaque parcelle.</p>
        </div>
        <FilterChips chips={chips} active={filter} onChange={setFilter} layoutId="address-filters" />
        <button onClick={() => setIsAddOpen(true)} className="group flex items-center gap-1.5 rounded-lg bg-[#1c1c1e] px-3.5 py-2 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-[#1c1c1e]">
          <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
          Ajouter une adresse
        </button>
      </div>
      {visible.length === 0 && <EmptyState icon={MapPinned} title="Aucune adresse enregistrée" description="Ajoutez l’agence, le domicile d’un client ou une école : Primo calcule le temps de trajet depuis chaque parcelle." action={{ label: "Ajouter une adresse", onClick: () => setIsAddOpen(true) }} />}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {visible.map((address, index) => (
          <AddressCard key={address.id} address={address} plots={plots} index={index} onDelete={() => deleteAddress(address.id)} />
        ))}
      </div>
      {isAddOpen && <AddProjectAddressModal onClose={() => setIsAddOpen(false)} projectId={projectId} />}
    </div>
  );
}
