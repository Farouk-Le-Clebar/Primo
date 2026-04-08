import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, } from "lucide-react";
import type { MemberRole } from "../../../../../types/member";

type RoleDropdownProps = {
    currentRole: MemberRole;
    onChange: (role: MemberRole) => void;
    disabled?: boolean;
};

const ROLE_CONFIG: Record<
    MemberRole,
    { label: string; color: string; bg: string }
> = {
    owner: {
        label: "Propriétaire",
        color: "text-gray-700",
        bg: " ",
    },
    admin: {
        label: "Admin",
        color: "text-gray-700",
        bg: " ",
    },
    "co-admin":{
        label: "Co-Admin",
        color: "text-gray-700",
        bg: " ",
    },
    editor: {
        label: "Éditeur",
        color: "text-gray-700",
        bg: " ",
    },
    viewer: {
        label: "Lecteur",
        color: "text-gray-700",
        bg: " ",
    },
};

const ASSIGNABLE_ROLES: MemberRole[] = ["admin", "co-admin", "editor", "viewer"];

const RoleDropdown: React.FC<RoleDropdownProps> = ({
    currentRole,
    onChange,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const config = ROLE_CONFIG[currentRole];

    if (disabled || currentRole === "owner") {
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 ring-1 ring-gray-300 rounded-md text-xs font-medium ${config.color} ${config.bg}`}
            >
                {config.label}
            </span>
        );
    }

    return (
        <div ref={ref} className="relative ">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors ring-1 ring-gray-300 ${config.color} ${config.bg}`}
            >
                {config.label}
                <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-25 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {ASSIGNABLE_ROLES.map((role) => {
                        const rc = ROLE_CONFIG[role];
                        return (
                            <button
                                key={role}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(role);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-gray-50 ${
                                    role === currentRole
                                        ? "font-semibold text-gray-900"
                                        : "text-gray-600"
                                }`}
                            >
                                {rc.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RoleDropdown;
