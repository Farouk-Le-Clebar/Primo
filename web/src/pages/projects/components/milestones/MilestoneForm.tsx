import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import FormField, { FIELD_CLASS } from "../../../../ui/FormField";
import type { CreateMilestonePayload } from "../../../../types/project/milestones";
import SectionCard from "../ui/SectionCard";

type MilestoneFormProps = {
  isSaving: boolean;
  onSubmit: (payload: CreateMilestonePayload, reset: () => void) => void;
};

export default function MilestoneForm({ isSaving, onSubmit }: MilestoneFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setTitle("");
    setDueDate("");
    setDescription("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), dueDate: dueDate || null, description: description.trim() || null }, reset);
  };

  return (
    <SectionCard title="Nouveau jalon" subtitle="Une étape clé à valider pendant le projet">
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <FormField label="Intitulé" htmlFor="milestone-title">
          <input id="milestone-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} required placeholder="Ex : Compromis signé" className={FIELD_CLASS} />
        </FormField>
        <FormField label="Date prévue" htmlFor="milestone-date" optional>
          <input id="milestone-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={FIELD_CLASS} />
        </FormField>
        <FormField label="Détail" htmlFor="milestone-description" optional>
          <textarea id="milestone-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} rows={2} placeholder="Ce qu'il faut pour valider l'étape" className={`${FIELD_CLASS} resize-none`} />
        </FormField>
        <button
          type="submit"
          disabled={isSaving || !title.trim()}
          className="group flex items-center justify-center gap-1.5 rounded-lg bg-[#1c1c1e] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 dark:bg-white dark:text-[#1c1c1e]"
        >
          <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
          Ajouter le jalon
        </button>
      </form>
    </SectionCard>
  );
}
