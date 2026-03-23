import { memo } from "react";
import type { ActivityEventResponse } from "../../../../../../../types/project/projectHistory";
import { getEventLabel } from "../../../../../../../utils/history";
import { EventDate } from "./EventDate";

type CreationAnchorProps = {
    event: ActivityEventResponse | undefined;
    projectName?: string;
};

export const CreationAnchor = memo(
    ({ event, projectName }: CreationAnchorProps) => {
        const label = event
            ? getEventLabel(
                  event.eventType,
                  event.payload,
                  event.actorDisplayName,
              )
            : `Projet "${projectName ?? ""}" créé`;

        return (
            <div className="flex-shrink-0 bg-gray-50 px-4 py-3 rounded-b-xl">
                <div className="flex gap-3 items-start">
                    <div className="min-w-0">
                        <span className="inline-block mb-1 text-[10px] font-semibold tracking-widest uppercase text-[#388160] bg-green-50 border border-green-200 rounded px-1.5 py-0.5">
                            Création du projet
                        </span>
                        <p className="text-sm text-gray-600 leading-snug">
                            {label}
                        </p>
                        {event && (
                            <div className="mt-0.5 flex items-center gap-1.5">
                                <span
                                    aria-hidden="true"
                                    className="inline-block h-[4px] w-[4px] rounded-full bg-gray-300"
                                />
                                <EventDate iso={event.createdAt} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    },
);
CreationAnchor.displayName = "CreationAnchor";
