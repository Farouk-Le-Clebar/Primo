import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type {
    ActivityDisplayItem,
    Granularity,
    TimeBucket,
} from "../types/project/projectHistoryFeed";

const DAY_SHORT = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"] as const;

const MONTH_SHORT = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
] as const;

export function startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfWeek(d: Date): Date {
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    return startOfDay(monday);
}

export function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addDays(d: Date, n: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}

export function addWeeks(d: Date, n: number): Date {
    return addDays(d, n * 7);
}

export function addMonths(d: Date, n: number): Date {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function isoWeekNumber(d: Date): number {
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(
        ((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
}

function dayKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekKey(d: Date): string {
    const w = startOfWeek(d);
    return `${w.getFullYear()}-W${String(isoWeekNumber(w)).padStart(2, "0")}`;
}

function monthKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function generateDayBuckets(
    items: ActivityDisplayItem[],
    count: number,
): TimeBucket[] {
    const today = startOfDay(new Date());
    const todayKey = dayKey(today);

    return Array.from({ length: count }, (_, i) => {
        const day = addDays(today, i - (count - 1));
        const start = day;
        const end = addDays(day, 1);
        const key = dayKey(day);
        return {
            key,
            sublabel: DAY_SHORT[day.getDay()],
            label: String(day.getDate()),
            start,
            end,
            isCurrent: key === todayKey,
            items: filterAndSort(items, start, end),
        };
    });
}

export function generateWeekBuckets(
    items: ActivityDisplayItem[],
    count: number,
): TimeBucket[] {
    const currentWeekStart = startOfWeek(new Date());
    const currentKey = weekKey(currentWeekStart);

    return Array.from({ length: count }, (_, i) => {
        const ws = addWeeks(currentWeekStart, i - (count - 1));
        const we = addDays(ws, 7);
        const key = weekKey(ws);
        return {
            key,
            sublabel: "S",
            label: String(isoWeekNumber(ws)),
            start: ws,
            end: we,
            isCurrent: key === currentKey,
            items: filterAndSort(items, ws, we),
        };
    });
}

export function generateMonthBuckets(
    items: ActivityDisplayItem[],
    count: number,
): TimeBucket[] {
    const today = new Date();
    const currentKey = monthKey(today);

    return Array.from({ length: count }, (_, i) => {
        const ms = addMonths(startOfMonth(today), i - (count - 1));
        const me = addMonths(ms, 1);
        const key = monthKey(ms);
        return {
            key,
            sublabel: undefined,
            label: MONTH_SHORT[ms.getMonth()],
            start: ms,
            end: me,
            isCurrent: key === currentKey,
            items: filterAndSort(items, ms, me),
        };
    });
}

export function buildBuckets(
    items: ActivityDisplayItem[],
    variant: "widget" | "page",
    granularity: Granularity,
    bucketWindow: number,
): TimeBucket[] {
    if (variant === "widget") return generateDayBuckets(items, bucketWindow);

    switch (granularity) {
        case "day":
            return generateDayBuckets(items, bucketWindow);
        case "week":
            return generateWeekBuckets(items, bucketWindow);
        case "month":
            return generateMonthBuckets(items, bucketWindow);
    }
}

function toDate(v: string | Date): Date {
    return v instanceof Date ? v : new Date(v);
}

function filterAndSort(
    items: ActivityDisplayItem[],
    start: Date,
    end: Date,
): ActivityDisplayItem[] {
    return items
        .filter((item) => {
            const d = toDate(item.occurredAt);
            return d >= start && d < end;
        })
        .sort(
            (a, b) =>
                toDate(b.occurredAt).getTime() - toDate(a.occurredAt).getTime(),
        );
}

export function useSlidingPill(
    containerRef: React.RefObject<HTMLElement | null>,
    activeKey: string,
) {
    const [pillStyle, setPillStyle] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    const measure = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const active = container.querySelector<HTMLElement>(
            '[data-active="true"]',
        );
        if (!active) return;
        const cRect = container.getBoundingClientRect();
        const aRect = active.getBoundingClientRect();
        setPillStyle({
            left: aRect.left - cRect.left,
            width: aRect.width,
            opacity: 1,
        });
    }, [containerRef]);

    useLayoutEffect(() => {
        measure();
    }, [activeKey, measure]);

    useEffect(() => {
        const ro = new ResizeObserver(measure);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [containerRef, measure]);

    return pillStyle;
}
