import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderPlus } from "lucide-react";
import toast from "react-hot-toast";
import { createProject } from "../../requests/projects";
import Modal from "../../ui/Modal";
import ModalButton from "../../ui/ModalButton";
import FormField, { FIELD_CLASS } from "../../ui/FormField";

type CreateProjectModalProps = {
  onClose: () => void;
};

const FORM_ID = "create-project-form";

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: () => createProject(name.trim(), description.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projet créé");
      onClose();
    },
    onError: () => toast.error("La création du projet a échoué."),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim()) mutate();
  };

  return (
    <Modal
      title="Créer un projet"
      subtitle="Regroupez parcelles, documents et notes avec votre équipe."
      icon={FolderPlus}
      onClose={onClose}
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>Annuler</ModalButton>
          <ModalButton type="submit" form={FORM_ID} icon={FolderPlus} isLoading={isPending} disabled={!name.trim()}>Créer le projet</ModalButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Nom du projet" htmlFor="project-name">
          <input id="project-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="Ex. Lotissement Les Oliviers" className={FIELD_CLASS} />
        </FormField>
        <FormField label="Description" htmlFor="project-description" optional>
          <textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Objectif, secteur, budget…" className={`${FIELD_CLASS} resize-none`} />
        </FormField>
      </form>
    </Modal>
  );
}
