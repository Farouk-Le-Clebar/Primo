type TableFooterProps = {
    currentPage: number;
    handleNext: () => void;
    handlePrevious: () => void;
    canNext: boolean;
};

const TableFooter = ({ currentPage, handleNext, handlePrevious, canNext }: TableFooterProps) => (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="cursor-pointer px-4 py-2 text-xs font-UberMoveBold text-white bg-[#388160] rounded-lg hover:bg-[#2d664c] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
            Précédent
        </button>
        <span className="text-xs text-gray-500 font-UberMove">
            Page {currentPage}
        </span>
        <button
            onClick={handleNext}
            disabled={!canNext}
            className="cursor-pointer px-4 py-2 text-xs font-UberMoveBold text-white bg-[#388160] rounded-lg hover:bg-[#2d664c] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
            Suivant
        </button>
    </div>
);

export default TableFooter;