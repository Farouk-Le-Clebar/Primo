import { useEffect, useRef, useState, type ReactNode } from "react";
import { clampScore, scoreColor } from "./utils";

const DEFAULT_DURATION_MS = 700;

function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
    );
}

export function useAnimatedNumber(
    target: number,
    duration = DEFAULT_DURATION_MS,
): number {
    const [value, setValue] = useState(0);
    const valueRef = useRef(0);

    useEffect(() => {
        if (prefersReducedMotion()) {
            valueRef.current = target;
            setValue(target);
            return;
        }
        const from = valueRef.current;
        const startedAt = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - (1 - progress) ** 3;
            const next = from + (target - from) * eased;
            valueRef.current = next;
            setValue(next);
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}

type ScoreRingProps = {
    score: number;
    size?: number;
    stroke?: number;
    ariaLabel: string;
    title?: string;
    centerClassName?: string;
    children?: ReactNode | ((animatedScore: number) => ReactNode);
};

export default function ScoreRing({
    score,
    size = 80,
    stroke = 8,
    ariaLabel,
    title,
    centerClassName = "text-xs font-semibold",
    children,
}: ScoreRingProps) {
    const value = useAnimatedNumber(clampScore(score));
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div
            role="img"
            aria-label={ariaLabel}
            title={title}
            className="relative flex shrink-0 items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
                aria-hidden="true"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={stroke - 2}
                    className="stroke-neutral-100 dark:stroke-slate-700"
                />
                {value > 0 && (
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={scoreColor(value)}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - value / 100)}
                    />
                )}
            </svg>
            <span
                className={`absolute whitespace-nowrap text-slate-900 dark:text-slate-100 ${centerClassName}`}
            >
                {typeof children === "function" ? children(value) : children}
            </span>
        </div>
    );
}
