import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

const NoScrollZone = ({ children }: { children: React.ReactNode }) => {
    const map = useMap();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !map) return;

        const disableScroll = () => map.scrollWheelZoom.disable();
        const enableScroll = () => map.scrollWheelZoom.enable();

        el.addEventListener('mouseenter', disableScroll);
        el.addEventListener('mouseleave', enableScroll);

        return () => {
            el.removeEventListener('mouseenter', disableScroll);
            el.removeEventListener('mouseleave', enableScroll);
            enableScroll();
        };
    }, [map]);

    return <div ref={ref} className="contents">{children}</div>;
};

export default NoScrollZone;