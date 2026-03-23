import { memo, useEffect, useRef } from "react";

type SentinelProps = {
    onIntersect: () => void;
    isFetching: boolean;
};

export const Sentinel = memo(({ onIntersect, isFetching }: SentinelProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetching) onIntersect();
            },
            { threshold: 0.1 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [onIntersect, isFetching]);

    return <div ref={ref} aria-hidden="true" className="h-3 w-full" />;
});
Sentinel.displayName = "Sentinel";
