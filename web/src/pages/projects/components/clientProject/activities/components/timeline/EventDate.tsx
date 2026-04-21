import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
    formatAbsolute,
    formatRelative,
} from "../../../../../../../utils/history";

type EventDateProps = {
    iso: string;
};

export const EventDate = memo(({ iso }: EventDateProps) => {
    const [showAbsolute, setShowAbsolute] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const toggleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (toggleTimeoutRef.current) {
                clearTimeout(toggleTimeoutRef.current);
            }
        };
    }, []);

    const handleToggle = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        toggleTimeoutRef.current = setTimeout(() => {
            setShowAbsolute((v) => !v);
            requestAnimationFrame(() => setIsTransitioning(false));
        }, 90);
    }, [isTransitioning]);

    return (
        <button
            type="button"
            onClick={handleToggle}
            title={
                showAbsolute ? "Afficher la date relative" : formatAbsolute(iso)
            }
            className="text-xs text-gray-400 tabular-nums hover:text-gray-500 transition-colors cursor-pointer"
        >
            <time
                dateTime={iso}
                className={`inline-block transition-[filter,opacity,transform] duration-200 ease-out will-change-[filter,opacity,transform] ${
                    isTransitioning
                        ? "blur-[1.5px] opacity-70"
                        : "blur-0 opacity-100"
                }`}
            >
                {showAbsolute ? formatAbsolute(iso) : formatRelative(iso)}
            </time>
        </button>
    );
});
EventDate.displayName = "EventDate";
