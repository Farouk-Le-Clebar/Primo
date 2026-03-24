import type { ReactNode } from "react";

export type Granularity = "day" | "week" | "month";

export type ActivityDisplayItem = {
    id: string;
    occurredAt: string | Date;
    actorName: string;
    actorAvatarUrl?: string | null;
    message: ReactNode;
    projectId?: string;
    projectName?: string;
    meta?: Record<string, unknown>;
}

export type TimeBucket = {
    key: string;
    label: string;
    sublabel?: string;
    start: Date;
    end: Date;
    isCurrent: boolean;
    items: ActivityDisplayItem[];
}


interface ActivityFeedBaseProps {
    items: ActivityDisplayItem[];
    onBucketChange?: (bucketKey: string) => void;
    onItemClick?: (item: ActivityDisplayItem) => void;
    loading?: boolean;
    emptyState?: ReactNode;
    className?: string;
}

interface ActivityFeedWidgetProps extends ActivityFeedBaseProps {
    variant: "widget";
    /**
     * @default 7
     */
    dayWindow?: number;
    allowedGranularities?: never;
    defaultGranularity?: never;
    bucketWindow?: never;
}

interface ActivityFeedPageProps extends ActivityFeedBaseProps {
    variant: "page";
    dayWindow?: never;
    /**  @default ["day","week","month"] */
    allowedGranularities?: Granularity[];
    /**  @default "day" */
    defaultGranularity?: Granularity;
    /**
     * @default 7
     */
    bucketWindow?: number;
}

export type ActivityFeedProps = ActivityFeedWidgetProps | ActivityFeedPageProps;