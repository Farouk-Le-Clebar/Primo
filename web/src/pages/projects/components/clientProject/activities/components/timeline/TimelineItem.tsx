import { memo } from "react";
import type { ActivityEventResponse } from "../../../../../../../types/project/projectHistory";
import {
    getEventLabel,
    getEventStyle,
} from "../../../../../../../utils/history";
import { EventDate } from "./EventDate";

type TimelineItemProps = {
    event: ActivityEventResponse;
    isLast: boolean;
};

export const TimelineItem = memo(({ event, isLast }: TimelineItemProps) => {
    const label = getEventLabel(
        event.eventType,
        event.payload,
        event.actorDisplayName,
    );
    const { icon, bg, color } = getEventStyle(event.eventType);

    return (
        <li className="relative flex gap-3 pb-8 group">
            {!isLast && (
                <span
                    aria-hidden="true"
                    className="absolute left-[14px] top-[22px] bottom-0 border-l-2 border-dashed border-gray-200 group-hover:border-gray-300 transition-colors"
                />
            )}

            <span
                aria-hidden="true"
                className={`relative z-10 mt-[2px] flex-shrink-0 h-[30px] w-[30px] rounded-md flex items-center justify-center ${bg} ${color} ring-1 ring-inset ring-gray-200/60 group-hover:ring-gray-300 transition-all`}
            >
                {icon}
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 leading-snug">{label}</p>
                <div className="mt-1 flex items-center gap-1.5">
                    <span
                        aria-hidden="true"
                        className="inline-block h-[4px] w-[4px] rounded-full bg-gray-300 flex-shrink-0"
                    />
                    <EventDate iso={event.createdAt} />
                </div>
            </div>
        </li>
    );
});
TimelineItem.displayName = "TimelineItem";
