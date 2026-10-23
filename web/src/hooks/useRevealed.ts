import { useEffect, useState } from "react";

export function useRevealed(delay = 120): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return revealed;
}
