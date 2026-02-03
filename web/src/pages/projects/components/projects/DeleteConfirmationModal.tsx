import React from "react";
import type { DeleteConfirmationModalProps } from "../../../../types/project";

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    projectName,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Confirmer la suppression
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer le projet{" "}
                    <span className="font-semibold">"{projectName}"</span> ?
                    Cette action est irréversible.
                </p>

                {/* Action buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
