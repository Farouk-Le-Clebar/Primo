import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const NoScrollZone = ({ children }: { children: React.ReactNode }) => {
    const map = useMap();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !map) return;

        const disableScrollAndDrag = () => {
            map.scrollWheelZoom.disable();
            map.dragging.disable();
        };
        const enableScrollAndDrag = () => {
            map.scrollWheelZoom.enable();
            map.dragging.enable();
        };

        el.addEventListener('mouseenter', disableScrollAndDrag);
        el.addEventListener('mouseleave', enableScrollAndDrag);

        return () => {
            el.removeEventListener('mouseenter', disableScrollAndDrag);
            el.removeEventListener('mouseleave', enableScrollAndDrag);
            enableScrollAndDrag();
        };
    }, [map]);

    return <div ref={ref} className="contents cursor-default">{children}</div>;
};

export default NoScrollZone;