import { useState } from "react";
import { Plus } from "lucide-react";
import ProjectSelect from "../../../../../../../components/projectAddresses/ProjectSelect";
import AddProjectAddressModal from "../../../../../../../components/projectAddresses/AddProjectAddressModal";
import CategorySection from "./CategorySection";
import type { InfraCategory } from "./constants";

type CustomCategorySectionProps = {
  category: InfraCategory;
  projectId: string;
  onProjectChange: (projectId: string) => void;
  selectedTypes: string[];
  isExpanded: boolean;
  onToggleExpanded: (label: string) => void;
  onToggleType: (code: string) => void;
  onSetTypes: (codes: string[], selected: boolean) => void;
};

const HINT_CLASS = "text-[11px] text-gray-500 dark:text-gray-400";

export default function CustomCategorySection({ projectId, onProjectChange, ...sectionProps }: CustomCategorySectionProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const isEmpty = sectionProps.category.types.length === 0;

  const handleOpenAdd = () => setIsAddOpen(true);
  const handleCloseAdd = () => setIsAddOpen(false);

  return (
    <CategorySection {...sectionProps}>
      <div className="space-y-2 pb-1">
        <div className="flex items-center gap-2">
          <ProjectSelect value={projectId} onChange={onProjectChange} placeholder="Adresses d'un projet" className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={handleOpenAdd}
            title="Ajouter une adresse"
            aria-label="Ajouter une adresse"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white cursor-pointer"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
        {!projectId && <p className={HINT_CLASS}>Choisissez un projet pour utiliser ses adresses.</p>}
        {projectId && isEmpty && <p className={HINT_CLASS}>Aucune adresse dans ce projet.</p>}
      </div>
      {isAddOpen && <AddProjectAddressModal onClose={handleCloseAdd} projectId={projectId || undefined} />}
    </CategorySection>
  );
}
