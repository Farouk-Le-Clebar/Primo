import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { addAdminPermission } from "../../../../requests/admin";
import Modal from "../../../../ui/Modal";
import ModalButton from "../../../../ui/ModalButton";
import FormField, { FIELD_CLASS } from "../../../../ui/FormField";

type AddAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type RequestError = { response?: { data?: { message?: string } } };

const FORM_ID = "add-admin-form";

export default function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: () => addAdminPermission(email.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "get", "admins"] });
      setEmail("");
      setError("");
      onClose();
    },
    onError: (requestError: RequestError) => setError(requestError.response?.data?.message ?? "Une erreur est survenue"),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) mutate();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Ajouter un administrateur"
      subtitle="L’utilisateur doit déjà avoir un compte Primo."
      icon={ShieldCheck}
      onClose={onClose}
      footer={
        <>
          <ModalButton variant="secondary" onClick={onClose}>Annuler</ModalButton>
          <ModalButton type="submit" form={FORM_ID} icon={ShieldCheck} isLoading={isPending} disabled={!email.trim()}>Promouvoir</ModalButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p><span className="font-semibold">Accès complet.</span> Cet utilisateur pourra gérer les comptes, les administrateurs et les retours.</p>
        </div>
        <FormField label="Adresse e-mail" htmlFor="admin-email">
          <input id="admin-email" autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="collaborateur@primo-data.fr" className={FIELD_CLASS} />
        </FormField>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </form>
    </Modal>
  );
}
