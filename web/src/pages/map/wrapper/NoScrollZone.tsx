import { useEffect, useRef } from "react";
import L from "leaflet";

const NoScrollZone = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        L.DomEvent.disableClickPropagation(el);
        L.DomEvent.disableScrollPropagation(el);

    }, []);

    return (
        <div ref={ref} className="w-full h-full cursor-default">
            {children}
        </div>
    );
};

export default NoScrollZone;