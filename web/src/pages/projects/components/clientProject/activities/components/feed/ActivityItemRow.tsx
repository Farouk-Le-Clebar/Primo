import { memo, useCallback } from "react";
import type { ActivityDisplayItem } from "../../../../../../../types/project/projectHistoryFeed";
import { formatRelative } from "../../../../../../../utils/history";
import Avatar from "../../../../../../../components/avatar/Avatar";

type ActivityItemRowProps = {
    item: ActivityDisplayItem;
    showProject: boolean;
    onClick?: (item: ActivityDisplayItem) => void;
};

export const ActivityItemRow = memo(
    ({ item, showProject, onClick }: ActivityItemRowProps) => {
        const handleClick = useCallback(() => onClick?.(item), [item, onClick]);
        const relativeTime =
            typeof item.occurredAt === "string"
                ? formatRelative(item.occurredAt)
                : formatRelative(item.occurredAt.toISOString());

        return (
            <li
                className={`flex items-start gap-3 py-3 ${
                    onClick
                        ? "cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors duration-150"
                        : ""
                }`}
                onClick={onClick ? handleClick : undefined}
            >
                {/* Pour utiliser des initials ->  <AvatarI name={item.actorName} size={36} /> */}
                <Avatar profilePicture={item.actorAvatarUrl} size="w-9 h-9" />

                <div className="min-w-0 flex-1">
                    {showProject && item.projectName && (
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide block mb-0.5">
                            {item.projectName}
                        </span>
                    )}
                    <p className="text-sm text-gray-800 leading-snug">
                        {item.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {relativeTime}
                    </p>
                </div>
            </li>
        );
    },
);
ActivityItemRow.displayName = "ActivityItemRow";
