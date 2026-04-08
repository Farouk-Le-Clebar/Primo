import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MemberOption } from "../../../../../../../types/project/projectHistoryFeed";
import Avatar from "../../../../../../../components/avatar/Avatar";

type TimelineMemberFilterProps = {
    options: MemberOption[];
    selected: string | null;
    onChange: (actorName: string | null) => void;
};

export const TimelineMemberFilter = memo(
    ({ options, selected, onChange }: TimelineMemberFilterProps) => {
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
            (value: string | null) => {
                onChange(value);
                setOpen(false);
            },
            [onChange],
        );

        const selectedLabel = selected ?? "Tout le monde";

        return (
            <div ref={containerRef} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={`w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left transition-colors duration-150 hover:border-gray-300 ${
                        open ? "border-gray-300" : ""
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="text-xs text-gray-500">
                        Voir :
                        <span className="ml-1.5 font-semibold text-gray-800">
                            {selectedLabel}
                        </span>
                    </span>
                    <ChevronDown
                        className={`h-3.5 w-3.5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                            open ? "rotate-180 text-gray-700" : ""
                        }`}
                    />
                </button>

                {open && (
                    <div
                        role="listbox"
                        aria-label="Filtrer la timeline par membre"
                        className="absolute right-0 bottom-full mb-2 z-50 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg overflow-hidden"
                        style={{
                            animation:
                                "timelineMemberFilterIn 170ms cubic-bezier(0.4,0,0.2,1)",
                        }}
                    >
                        <TimelineMemberOptionRow
                            name={null}
                            avatarUrl={null}
                            isSelected={selected === null}
                            onSelect={handleSelect}
                        />

                        {options.length > 0 && (
                            <>
                                <div className="mx-3 my-1 border-t border-gray-100" />
                                <div
                                    className="overflow-y-auto"
                                    style={{
                                        maxHeight: "172px",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {options.map((opt) => (
                                        <TimelineMemberOptionRow
                                            key={opt.actorName}
                                            name={opt.actorName}
                                            avatarUrl={opt.avatarUrl}
                                            isSelected={
                                                selected === opt.actorName
                                            }
                                            onSelect={handleSelect}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <style>{`
                    @keyframes timelineMemberFilterIn {
                        from { opacity: 0; transform: translateY(4px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        );
    },
);
TimelineMemberFilter.displayName = "TimelineMemberFilter";

type TimelineMemberOptionRowProps = {
    name: string | null;
    avatarUrl: string | null | undefined;
    isSelected: boolean;
    onSelect: (name: string | null) => void;
};

const TimelineMemberOptionRow = memo(
    ({
        name,
        avatarUrl,
        isSelected,
        onSelect,
    }: TimelineMemberOptionRowProps) => (
        <button
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(name)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-100 ${
                isSelected
                    ? "bg-gray-50 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
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
TimelineMemberOptionRow.displayName = "TimelineMemberOptionRow";
