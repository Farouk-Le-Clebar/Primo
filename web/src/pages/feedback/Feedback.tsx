import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import { sendFeedback } from "../../requests/feedback"; 
import {
  TextInput,
  Textarea,
  Button,
  Divider
} from "@tremor/react";

export default function Feedback() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendFeedback({ title, description, userId }),
    onSuccess: () => {
      toast.success("Merci ! Votre retour a bien été envoyé.");
      setTitle("");
      setDescription("");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de votre retour.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Merci de remplir tous les champs.");
      return;
    }
    mutate();
  };

  return (
    <div className="flex flex-col w-full h-full p-6 sm:p-10 overflow-y-auto bg-transparent dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
          Retours et Suggestions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
          Aidez-nous à améliorer Primo. Signalez un bug ou proposez une nouvelle fonctionnalité.
        </p>
      </div>

      <Divider className="my-8 dark:bg-white/10" />

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            Nouveau ticket
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400 transition-colors duration-200">
            Détaillez votre problème ou votre idée. Ces informations nous aident à comprendre vos besoins et à corriger les éventuels bugs plus rapidement.
          </p>
        </div>

        <div className="md:col-span-2 sm:max-w-3xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre du retour <span className="text-red-500">*</span>
              </label>
              <TextInput
                id="title"
                placeholder="Ex: Bug sur la carte, Idée de fonctionnalité..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description détaillée <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Décrivez votre problème ou votre idée avec le plus de détails possible..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="dark:bg-[#0A0A0A] dark:border-white/10 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Plus vous serez précis, plus vite nous pourrons traiter votre demande.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                icon={Send}
                loading={isPending}
                disabled={!title || !description || isPending}
                className="dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
              >
                Envoyer mon retour
              </Button>
            </div>

          </form>
        </div>
        
      </div>
    </div>
  );
}