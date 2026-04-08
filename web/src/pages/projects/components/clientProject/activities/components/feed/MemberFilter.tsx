import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MemberOption } from "../../../../../../../types/project/projectHistoryFeed";
import Avatar from "../../../../../../../components/avatar/Avatar";

type MemberFilterProps = {
    options: MemberOption[];
    selected: string | null;
    onChange: (actorName: string | null) => void;
};

export const MemberFilter = memo(
    ({ options, selected, onChange }: MemberFilterProps) => {
        const [open, setOpen] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!open) return;
            const handler = (e: MouseEvent) => {
                if (!containerRef.current?.contains(e.target as Node)) {
                    setOpen(false);
                }
            };
            document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }, [open]);

        useEffect(() => {
            if (!open) return;
            const handler = (e: KeyboardEvent) => {
                if (e.key === "Escape") setOpen(false);
            };
            document.addEventListener("keydown", handler);
            return () => document.removeEventListener("keydown", handler);
        }, [open]);

        const handleSelect = useCallback(
            (value: string | null) => {
                onChange(value);
                setOpen(false);
            },
            [onChange],
        );

        const label = selected ?? "Tout le monde";

        return (
            <div ref={containerRef} className="relative flex-shrink-0 mt-2.5 ml-1">

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-1.5 text-xs hover:text-gray-800 transition-colors duration-150"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                >
                    <span className="font-semibold text-gray-800">{label}</span>
                    <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                            open ? "rotate-180 text-gray-800" : ""
                        }`}
                    />
                </button>

                {/* Dropdown */}
                {open && (
                    <div
                        role="listbox"
                        aria-label="Filtrer par membre"
                        className="absolute right-0 top-full mt-2 z-50 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 overflow-hidden"
                        style={{
                            animation: "feedFilterIn 150ms cubic-bezier(0.4,0,0.2,1)",
                        }}
                    >
                        {/* "Tout le monde" */}
                        <MemberOptionRow
                            name={null}
                            avatarUrl={null}
                            isSelected={selected === null}
                            onSelect={handleSelect}
                        />

                        {options.length > 0 && (
                            <>
                                <div className="mx-3 my-1 border-t border-gray-100" />

                                {/*Scrollable member list.*/}
                                <div
                                    className="overflow-y-auto"
                                    style={{
                                        maxHeight: "162px",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {options.map((opt) => (
                                        <MemberOptionRow
                                            key={opt.actorName}
                                            name={opt.actorName}
                                            avatarUrl={opt.avatarUrl}
                                            isSelected={selected === opt.actorName}
                                            onSelect={handleSelect}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <style>{`
                    @keyframes feedFilterIn {
                        from { opacity: 0; transform: translateY(-4px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        );
    },
);
MemberFilter.displayName = "MemberFilter";


interface MemberOptionRowProps {
    name: string | null;
    avatarUrl: string | null | undefined;
    isSelected: boolean;
    onSelect: (name: string | null) => void;
}

const MemberOptionRow = memo(
    ({ name, avatarUrl, isSelected, onSelect }: MemberOptionRowProps) => (
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
            {/* Avatar */}
            <div className="flex-shrink-0">
                {name === null ? (
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-bold select-none">
                        tlm
                    </span>
                ) : (
                    <Avatar profilePicture={avatarUrl} size="w-6 h-6" />
                )}
            </div>

            {/* blaze */}
            <span
                className={`min-w-0 flex-1 text-xs truncate pr-1 ${
                    isSelected ? "font-semibold" : "font-medium"
                }`}
            >
                {name ?? "Tout le monde"}
            </span>

        </button>
    ),
);
MemberOptionRow.displayName = "MemberOptionRow";