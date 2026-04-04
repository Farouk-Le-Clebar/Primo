import React from "react";
import toast from "react-hot-toast";

type NotesCardProps = {
    notes: string;
    isLoading: boolean;
    onNotesChange: (notes: string) => void;
    canEdit?: boolean;
};

const NotesCard: React.FC<NotesCardProps> = ({
    notes,
    isLoading,
    onNotesChange,
    canEdit = true,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
            <h3 className="text-sm px-2 font-semibold text-gray-900 mb-3">
                Notes
            </h3>

            <textarea
                value={notes}
                onChange={(e) => {
                    if (!canEdit) return;
                    onNotesChange(e.target.value);
                }}
                readOnly={!canEdit}
                onClick={() => {
                    if (!canEdit) {
                        toast.error(
                            "Vous n'avez pas les droits nécessaires pour modifier les notes",
                        );
                    }
                }}
                placeholder={
                    canEdit
                        ? "Écrivez vos notes ici..."
                        : "Aucune note (lecture seule)"
                }
                className={`flex-1 w-full p-2 text-sm text-gray-700 placeholder-gray-400 border-none focus:outline-none resize-none ${
                    !canEdit ? "cursor-not-allowed bg-gray-50/50" : ""
                }`}
            />

            {notes && (
                <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                        Sauvegarde automatique
                    </span>
                </div>
            )}
        </div>
    );
};

export default NotesCard;
