import { useState } from "react";

type MapColorsActionsProps = {
  isDirty: boolean;
  isDefault: boolean;
  isSaving: boolean;
  isResetting: boolean;
  isLeaveWarningVisible: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onReset: () => void;
  onConfirmLeave: () => void;
  onCancelLeave: () => void;
};

type ConfirmationProps = {
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600";
const SECONDARY_BUTTON = `h-8 rounded-lg px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-black/[0.05] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/[0.08] ${FOCUS_RING}`;
const PRIMARY_BUTTON = `h-8 rounded-lg bg-black px-3.5 text-xs font-medium text-white transition-opacity hover:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black ${FOCUS_RING}`;
const BAR = "sticky bottom-4 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white p-2 pl-4 shadow-sm dark:border-white/10 dark:bg-[#1c1c1e]";

function Confirmation({ message, cancelLabel, confirmLabel, onCancel, onConfirm }: ConfirmationProps) {
  return (
    <div role="alert" className={BAR}>
      <p className="min-w-0 flex-1 text-sm text-gray-700 dark:text-gray-200">{message}</p>
      <button type="button" autoFocus onClick={onCancel} className={SECONDARY_BUTTON}>{cancelLabel}</button>
      <button type="button" onClick={onConfirm} className={PRIMARY_BUTTON}>{confirmLabel}</button>
    </div>
  );
}

export default function MapColorsActions({ isDirty, isDefault, isSaving, isResetting, isLeaveWarningVisible, onSave, onDiscard, onReset, onConfirmLeave, onCancelLeave }: MapColorsActionsProps) {
  const [isResetRequested, setIsResetRequested] = useState(false);
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false);

  const handleCancelReset = () => {
    setShouldRestoreFocus(true);
    setIsResetRequested(false);
  };

  const handleCancelLeave = () => {
    setShouldRestoreFocus(true);
    onCancelLeave();
  };

  const handleConfirmReset = () => {
    setIsResetRequested(false);
    onReset();
  };

  if (isLeaveWarningVisible) {
    return <Confirmation message="Quitter sans enregistrer ?" cancelLabel="Rester" confirmLabel="Quitter" onCancel={handleCancelLeave} onConfirm={onConfirmLeave} />;
  }

  if (isResetRequested) {
    return <Confirmation message="Revenir aux couleurs par défaut ?" cancelLabel="Non" confirmLabel="Réinitialiser" onCancel={handleCancelReset} onConfirm={handleConfirmReset} />;
  }

  return (
    <div className={BAR}>
      <button type="button" autoFocus={shouldRestoreFocus} onClick={() => setIsResetRequested(true)} disabled={isDefault || isResetting} className={`${SECONDARY_BUTTON} -ml-2 mr-auto`}>
        {isResetting ? "Réinitialisation..." : "Réinitialiser"}
      </button>
      <button type="button" onClick={onDiscard} disabled={!isDirty || isSaving} className={SECONDARY_BUTTON}>Annuler</button>
      <button type="button" onClick={onSave} disabled={!isDirty || isSaving} className={PRIMARY_BUTTON}>
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
