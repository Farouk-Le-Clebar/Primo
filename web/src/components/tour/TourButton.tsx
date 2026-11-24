import { Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { startTour } from "./startTour";
import { hasSeenTour } from "./tourProgress";
import { requestTour, useCurrentTour, useFinishedCount } from "./tourStore";
import { TOURS } from "./tours";

export default function TourButton() {
  const navigate = useNavigate();
  const currentTour = useCurrentTour();
  useFinishedCount();
  const label = currentTour ? TOURS[currentTour].label : TOURS.map.label;
  const isNew = currentTour !== null && !hasSeenTour(currentTour);

  const handleClick = () => {
    if (currentTour) {
      startTour(currentTour);
      return;
    }
    navigate(ROUTES.map);
    requestTour("map");
  };

  return (
    <button
      data-tour="tour-button"
      onClick={handleClick}
      aria-label={`Guide : ${label}`}
      title={label}
      className="group relative flex h-9 w-9 items-center justify-center rounded-[10px] text-[#1c1c1e]/78 transition-colors duration-150 hover:bg-[#1c1c1e]/[0.07] dark:text-white/78 dark:hover:bg-white/[0.07]"
    >
      <Compass
        className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[135deg]"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {isNew && (
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
      )}
    </button>
  );
}
