import { useState } from "react";
import { MapPinPlus } from "lucide-react";
import { useAddProjectAddress } from "../../hooks/useProjectAddresses";
import type { AddressSuggestion } from "../../hooks/useAddokSuggestions";
import type { AddressCategory } from "../../types/project/addresses";
import Modal from "../../ui/Modal";
import ModalButton from "../../ui/ModalButton";
import FormField, { FIELD_CLASS } from "../../ui/FormField";
import AddressAutocomplete from "./AddressAutocomplete";
import ProjectSelect from "./ProjectSelect";
import AddressCategoryPicker from "./AddressCategoryPicker";

type AddProjectAddressModalProps = {
  onClose: () => void;
  projectId?: string;
};

const DESCRIPTION_MAX_LENGTH = 500;

export default function AddProjectAddressModal({ onClose, projectId }: AddProjectAddressModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projectId ?? "");
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AddressCategory>("client");
  const [description, setDescription] = useState("");
  const { mutate, isPending } = useAddProjectAddress(onClose);
  const canSubmit = !!selectedProjectId && !!selectedAddress;

  const handleSubmit = () => {
    if (!selectedAddress) return;
    mutate({
      projectId: selectedProjectId,
      payload: {
        address: selectedAddress.label,
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
        description: description.trim() || undefined,
        name: name.trim() || undefined,
        category,
      },
    });
  };

  return (
    <Modal
      title="Ajouter une adresse"
      subtitle="Visible sur la carte et dans le détail des parcelles."
      icon={MapPinPlus}
      onClose={onClose}
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>Annuler</ModalButton>
          <ModalButton icon={MapPinPlus} isLoading={isPending} disabled={!canSubmit} onClick={handleSubmit}>Ajouter l’adresse</ModalButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {!projectId && (
          <FormField label="Projet">
            <ProjectSelect value={selectedProjectId} onChange={setSelectedProjectId} />
          </FormField>
        )}
        <FormField label="Adresse">
          <AddressAutocomplete selected={selectedAddress} onSelect={setSelectedAddress} />
        </FormField>
        <FormField label="Nom" htmlFor="address-name" optional>
          <input id="address-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="Ex. Domicile des Lefèvre" className={FIELD_CLASS} />
        </FormField>
        <FormField label="Catégorie">
          <AddressCategoryPicker value={category} onChange={setCategory} />
        </FormField>
        <FormField label="Note" htmlFor="address-description" optional>
          <textarea id="address-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={DESCRIPTION_MAX_LENGTH} rows={2} placeholder="Code d’accès, horaires, contact…" className={`${FIELD_CLASS} resize-none`} />
        </FormField>
      </div>
    </Modal>
  );
}
