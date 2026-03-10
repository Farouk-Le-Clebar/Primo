import React, { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";
import type { MemberRole } from "../../../../../types/member";

type InviteMemberModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role?: MemberRole) => void;
    isLoading: boolean;
};

const ROLES: { value: MemberRole; label: string }[] = [
    { value: "viewer", label: "Lecteur" },
    { value: "editor", label: "Éditeur" },
    { value: "admin", label: "Admin" },
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
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-[20px] shadow-xl border border-gray-200 w-full max-w-md mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-5 mb-6">
                    <div className="w-10 h-10 border border-[#388160] rounded-full flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-[#388160]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            Inviter un membre
                        </h3>
                        <p className="text-xs text-gray-400">
                            Ajoutez un collaborateur au projet
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            placeholder="collaborateur@email.com"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#388160] focus:border-transparent"
                            autoFocus
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-xs text-red-500 mt-1">{error}</p>
                        )}
                    </div>

                    {/* Role selector */}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                            Rôle
                        </label>
                        <div className="flex gap-2">
                            {ROLES.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setRole(r.value)}
                                    className={`flex-1 px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                                        role === r.value
                                            ? "border-[#388160] bg-[#388160]/8 text-[#388160] font-medium"
                                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                                    disabled={isLoading}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            disabled={isLoading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-[#388160] rounded-lg hover:bg-[#2d664c] transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Inviter"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
