import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { ActivityEventResponse } from "../../../../../../../types/project/projectHistoryTimeline";
import type { MemberOption } from "../../../../../../../types/project/projectHistoryFeed";
import { getEventLabel } from "../../../../../../../utils/history";
import { EventDate } from "./EventDate";
import Avatar from "../../../../../../../components/avatar/Avatar";
import { ChevronDown } from "lucide-react";

type FooterProps = {
    event: ActivityEventResponse | undefined;
    projectName?: string;
    memberOptions: MemberOption[];
    selectedActor: string | null;
    onSelectActor: (actorName: string | null) => void;
};

export const FeedFooter = memo(
    ({
        event,
        projectName,
        memberOptions,
        selectedActor,
        onSelectActor,
    }: FooterProps) => {
        const [open, setOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!open) return;

            const handleClickOutside = (e: MouseEvent) => {
                if (!containerRef.current?.contains(e.target as Node)) {
                    setOpen(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, [open]);

        useEffect(() => {
            if (!open) return;

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape") setOpen(false);
            };

            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }, [open]);

        const handleSelect = useCallback(
            (actorName: string | null) => {
                onSelectActor(actorName);
                setOpen(false);
            },
            [onSelectActor],
        );

        const selectedLabel = selectedActor ?? "Tout le monde";

        const label = event
            ? getEventLabel(
                  event.eventType,
                  event.payload,
                  event.actorDisplayName,
              )
            : `Projet "${projectName ?? ""}" créé`;

        return (
            <div
                ref={containerRef}
                className="flex-shrink-0 bg-gray-50 px-4 py-3 rounded-b-xl border-t border-gray-100"
            >
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className="w-full flex items-center justify-between text-left"
                >
                    <span className="text-xs text-gray-500">
                        Voir :
                        <span className="ml-1.5 font-semibold text-gray-800">
                            {selectedLabel}
                        </span>
                    </span>
                    <ChevronDown
                        className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition-transform duration-250 ${
                            open ? "rotate-180 text-gray-700" : ""
                        }`}
                    />
                </button>

                <div
                    className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
                        open
                            ? "max-h-48 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-1"
                    }`}
                >
                    <div
                        role="listbox"
                        aria-label="Filtrer la timeline par membre"
                        className="mt-2 overflow-y-auto"
                        style={{ maxHeight: "172px", scrollbarWidth: "thin" }}
                    >
                        <MemberOptionRow
                            name={null}
                            avatarUrl={null}
                            isSelected={selectedActor === null}
                            onSelect={handleSelect}
                        />

                        {memberOptions.length > 0 && (
                            <>
                                <div className="mx-1 my-1 border-t border-gray-100" />
                                {memberOptions.map((opt) => (
                                    <MemberOptionRow
                                        key={opt.actorName}
                                        name={opt.actorName}
                                        avatarUrl={opt.avatarUrl}
                                        isSelected={
                                            selectedActor === opt.actorName
                                        }
                                        onSelect={handleSelect}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>

                <div className="my-2.5 border-t border-gray-200" />

                <div className="flex gap-3 items-start">
                    <div className="min-w-0">
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
FeedFooter.displayName = "FeedFooter";

type MemberOptionRowProps = {
    name: string | null;
    avatarUrl: string | null | undefined;
    isSelected: boolean;
    onSelect: (name: string | null) => void;
};

const MemberOptionRow = memo(
    ({ name, avatarUrl, isSelected, onSelect }: MemberOptionRowProps) => (
        <button
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(name)}
            className={`w-full flex items-center gap-2 px-1 py-1.5 text-left transition-colors duration-100 rounded ${
                isSelected
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100/70"
            }`}
        >
            <div className="flex-shrink-0">
                {name === null ? (
                    <span className="flex h-6 w-6 select-none items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-400">
                        tlm
                    </span>
                ) : (
                    <Avatar profilePicture={avatarUrl} size="w-6 h-6" />
                )}
            </div>

            <span
                className={`min-w-0 flex-1 truncate pr-1 text-xs ${
                    isSelected ? "font-semibold" : "font-medium"
                }`}
            >
                {name ?? "Tout le monde"}
            </span>
        </button>
    ),
);
MemberOptionRow.displayName = "MemberOptionRow";
