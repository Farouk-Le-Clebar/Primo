import { useEffect, type RefObject } from "react";

export function useStopPropagation(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const stopPropagation = (e: Event) => {
      e.stopPropagation();
    };

    element.addEventListener("wheel", stopPropagation);
    element.addEventListener("mousedown", stopPropagation);
    element.addEventListener("touchstart", stopPropagation);

    return () => {
      element.removeEventListener("wheel", stopPropagation);
      element.removeEventListener("mousedown", stopPropagation);
      element.removeEventListener("touchstart", stopPropagation);
    };
  }, [ref]);
}