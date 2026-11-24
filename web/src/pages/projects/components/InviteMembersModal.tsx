import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { inviteUserToProject } from "../../../requests/projects";
import Modal from "../../../ui/Modal";
import ModalButton from "../../../ui/ModalButton";
import FormField, { FIELD_CLASS } from "../../../ui/FormField";

type InviteMembersModalProps = {
  onClose: () => void;
  projectId: string;
};

type RequestError = { message?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_ID = "invite-member-form";

export default function InviteMembersModal({ onClose, projectId }: InviteMembersModalProps) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const isValid = EMAIL_PATTERN.test(email.trim());
  const { mutate, isPending } = useMutation({
    mutationFn: () => inviteUserToProject(projectId, email.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId, "members"] });
      toast.success("Invitation envoyée");
      onClose();
    },
    onError: (error: RequestError) => toast.error(error?.message ?? "Invitation impossible"),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValid) mutate();
  };

  return (
    <Modal
      title="Inviter un membre"
      subtitle="Il verra les nouveautés du projet dès sa connexion."
      icon={UserPlus}
      onClose={onClose}
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>Annuler</ModalButton>
          <ModalButton type="submit" form={FORM_ID} icon={UserPlus} isLoading={isPending} disabled={!isValid}>Envoyer l’invitation</ModalButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit}>
        <FormField label="Adresse e-mail" htmlFor="invite-email" hint="La personne invitée aura accès à l’intégralité du projet.">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#82828c]" />
            <input id="invite-email" autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="adresse@email.fr" className={`${FIELD_CLASS} pl-9`} />
          </div>
        </FormField>
      </form>
    </Modal>
  );
}
