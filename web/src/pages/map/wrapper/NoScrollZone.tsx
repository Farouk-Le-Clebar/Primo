import { useEffect, useRef } from "react";
import L from "leaflet";

const STOPPED_PRESS_EVENTS = "mousedown touchstart";
const PASSTHROUGH_SELECTOR = "[data-map-passthrough]";

const stopUnlessPassthrough = (event: Event) => {
    if (event.target instanceof Element && event.target.closest(PASSTHROUGH_SELECTOR)) return;
    L.DomEvent.stopPropagation(event);
};

const NoScrollZone = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        L.DomEvent.disableClickPropagation(el);
        L.DomEvent.off(el, STOPPED_PRESS_EVENTS, L.DomEvent.stopPropagation);
        L.DomEvent.on(el, STOPPED_PRESS_EVENTS, stopUnlessPassthrough);
        L.DomEvent.disableScrollPropagation(el);

    }, []);

    return (
        <div ref={ref} className="w-full h-full cursor-default">
            {children}
        </div>
    );
};

export default NoScrollZone;