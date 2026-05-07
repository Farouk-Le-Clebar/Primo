import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2, 
        top: rect.top, 
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-flex items-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            className="fixed z-[9999] pointer-events-none flex flex-col items-center"
            style={{
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              transform: "translate(-50%, calc(-100% - 8px))",
            }}
          >
            <span className="bg-gray-900 text-gray-50 text-xs font-medium px-2.5 py-1.5 rounded-md shadow-md whitespace-nowrap">
              {content}
            </span>
            <div className="w-2.5 h-2.5 bg-gray-900 rotate-45 -mt-1.5"></div>
          </div>,
          document.body
        )}
    </>
  );
}