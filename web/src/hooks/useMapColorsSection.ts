import { useEffect, useState } from "react";

export function useMapColorsSection(isDirty: boolean, onExit: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isLeaveRequested, setIsLeaveRequested] = useState(false);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const open = () => {
    setIsOpen(true);
    setHasOpened(true);
  };

  const leave = () => {
    onExit();
    setIsLeaveRequested(false);
    setIsOpen(false);
  };

  const requestClose = () => {
    if (isDirty) setIsLeaveRequested(true);
    else leave();
  };

  return {
    isOpen,
    hasOpened,
    isLeaveWarningVisible: isLeaveRequested && isDirty,
    open,
    requestClose,
    confirmLeave: leave,
    cancelLeave: () => setIsLeaveRequested(false),
  };
}
