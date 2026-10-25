import { useCallback, useState } from "react";

import { EMPTY_TARGET, type LogementTarget } from "./widgets/logement/types";

export function useLogementTarget(parcelId: string, onOpen: () => void) {
  const [state, setState] = useState<{ parcelId: string; target: LogementTarget }>({ parcelId, target: EMPTY_TARGET });
  const target = state.parcelId === parcelId ? state.target : EMPTY_TARGET;

  const setTarget = useCallback((next: LogementTarget) => setState({ parcelId, target: next }), [parcelId]);

  const openTarget = useCallback(
    (next: LogementTarget) => {
      setTarget(next);
      onOpen();
    },
    [setTarget, onOpen],
  );

  return { target, setTarget, openTarget };
}
