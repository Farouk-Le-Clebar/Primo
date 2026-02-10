import React from 'react';


type NotesCardProps = {
    notes: string;
    isLoading: boolean;
    onNotesChange: (notes: string) => void;
};


const NotesCard: React.FC<NotesCardProps> = ({
  notes,
  isLoading,
  onNotesChange
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
      <h3 className="text-sm px-2 font-semibold text-gray-900 mb-3">Notes</h3>

      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Écrivez vos notes ici..."
        className="flex-1 w-full p-2 text-sm text-gray-700 placeholder-gray-400 border-none focus:outline-none resize-none"
      />

      {notes && (
        <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">Sauvegarde automatique</span>
        </div>
      )}
    </div>
  );
};

export default NotesCard;

