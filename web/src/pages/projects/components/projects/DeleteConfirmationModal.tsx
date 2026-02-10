import React from "react";

type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectName?: string;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;
    return (
        <div
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 transition-transform duration-300 translate-x-0"
            style={{ minWidth: 20, maxWidth: 320, height: 64 }}
        >
            <div className="bg-[#F9FAFB] py-2 flex flex-col items-start w-full h-full justify-center">
                <div className="flex gap-2 self-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors border border-gray-300"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                        className="px-3 py-1 text-xs bg-red-500 text-white hover:bg-red-600 rounded transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
