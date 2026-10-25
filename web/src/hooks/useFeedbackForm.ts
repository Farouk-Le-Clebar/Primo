import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendFeedback } from "../requests/feedback";
import { FEEDBACK_CATEGORIES } from "../pages/feedback/feedbackCategories";
import type { FeedbackCategory } from "../pages/feedback/feedbackCategories";

export const TITLE_MIN_LENGTH = 3;
export const DESCRIPTION_MIN_LENGTH = 10;

export function useFeedbackForm() {
  const [category, setCategory] = useState<FeedbackCategory>(FEEDBACK_CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSent, setIsSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => sendFeedback({ title: `[${category.label}] ${title.trim()}`, description: description.trim() }),
    onSuccess: () => setIsSent(true),
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de votre retour.");
    },
  });

  const isValid = title.trim().length >= TITLE_MIN_LENGTH && description.trim().length >= DESCRIPTION_MIN_LENGTH;

  const submit = () => {
    if (!isValid || isPending) return;
    mutate();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleShortcut = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) submit();
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setIsSent(false);
  };

  return { category, setCategory, title, setTitle, description, setDescription, isPending, isValid, isSent, handleSubmit, handleShortcut, reset };
}
