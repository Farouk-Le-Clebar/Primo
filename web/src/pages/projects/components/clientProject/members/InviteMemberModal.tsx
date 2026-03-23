import React, { useState } from "react";
import {
    X,
    UserPlus,
    Loader2,
    Eye,
    Pen,
    ShieldCheck,
    Crown,
} from "lucide-react";
import type { MemberRole } from "../../../../../types/member";

type InviteMemberModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role?: MemberRole) => void;
    isLoading: boolean;
};

const ROLES: {
    value: MemberRole;
    label: string;
    description: string;
    icon: React.ReactNode;
}[][] = [
    [
        {
            value: "viewer",
            label: "LECTEUR",
            description: "Consultation uniquement",
            icon: <Eye className="w-3.5 h-3.5" />,
        },
        {
            value: "editor",
            label: "ÉDITEUR",
            description: "Peut modifier le contenu",
            icon: <Pen className="w-3.5 h-3.5" />,
        },
    ],
    [
        {
            value: "co-admin",
            label: "Co-ADMIN",
            description: "Gestion partielle",
            icon: <ShieldCheck className="w-3.5 h-3.5" />,
        },
        {
            value: "admin",
            label: "ADMIN",
            description: "Accès complet",
            icon: <Crown className="w-3.5 h-3.5" />,
        },
    ],
];

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
    isOpen,
    onClose,
    onInvite,
    isLoading,
}) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<MemberRole>("viewer");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const trimmed = email.trim();
        if (!trimmed) {
            setError("L'email est requis");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError("Format d'email invalide");
            return;
        }

        onInvite(trimmed, role);
    };

    const handleClose = () => {
        setEmail("");
        setRole("viewer");
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/[0.06] w-full max-w-sm mx-4 overflow-hidden"
                style={{
                    boxShadow:
                        "0 32px 64px -12px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04)",
                }}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/[0.03] transition-all cursor-pointer"
                >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 pt-6 pb-6 space-y-8">
                        {/* Header */}
                        <div className="flex items-center gap-3.5">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #388160 0%, #2d6650 100%)",
                                }}
                            >
                                <UserPlus
                                    className="w-4 h-4 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">
                                    Inviter un membre
                                </h3>
                                <p className="text-[12px] text-gray-400 mt-0.5">
                                    Ajoutez un collaborateur au projet
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                placeholder="collaborateur@email.com"
                                className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#EFEFF4] border-none focus:ring-1 focus:ring-[#388160] border border-gray-500 rounded-xl resize-none focus:outline-none focus:border-agendai "
                                autoFocus
                                disabled={isLoading}
                            />
                            {error && (
                                <p className="text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Role selector */}
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Rôle
                            </label>
                            <div className="grid grid-cols-2 rounded-xl border border-gray-200/80 overflow-hidden">
                                {ROLES.flat().map((r, index) => {
                                    const isSelected = role === r.value;
                                    const isLeftCol = index % 2 === 0;
                                    const isTopRow = index < 2;
                                    return (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setRole(r.value)}
                                            disabled={isLoading}
                                            className={`relative flex flex-col gap-1 px-3 py-2.5 text-left transition-all cursor-pointer
                                                ${isLeftCol ? "border-r border-gray-200/80" : ""}
                                                ${isTopRow ? "border-b border-gray-200/80" : ""}
                                                ${isSelected ? "bg-gray-50/90" : "hover:bg-gray-100/60"}
                                            `}
                                        >
                                            {/* Selected dot */}
                                            {isSelected && (
                                                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#388160] animate-pulse" />
                                            )}
                                            {/* Role label */}
                                            <span
                                                className={`flex items-center gap-1.5 text-[11.5px] font-medium tracking-tight ${
                                                    isSelected
                                                        ? "text-[#388160]"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {/* Role label icon*/}

                                                <span
                                                    className={
                                                        isSelected
                                                            ? "text-[#388160]"
                                                            : "text-gray-400"
                                                    }
                                                >
                                                    {r.icon}
                                                </span>
                                                {r.label}
                                            </span>
                                            {/* Role description */}
                                            <span
                                                className={`text-[10.5px] leading-tight font-semibold ${
                                                    isSelected
                                                        ? "text-gray-600"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {r.description}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50/80 border-t border-gray-200/80 px-6 py-5">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2.5 text-[13px] font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                                disabled={isLoading}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white rounded-md transition-all cursor-pointer disabled:opacity-50 bg-[#388160] hover:bg-[#31704a]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    "Inviter"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
