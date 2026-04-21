import { Plus } from "lucide-react";
import Button from "../../../../ui/Button";

type TableFooterProps = {
    onAddAdmin: () => void;
}

const TableFooter = ({ onAddAdmin }: TableFooterProps) => (
    <div className="flex justify-end items-center px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <Button
            onClick={onAddAdmin}
            backgroundColor="bg-gray-900"
            backgroundHoverColor="bg-black"
            width="w-auto"
            textSize="text-sm"
            className="pl-4 pr-4"
        >
            <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <p>Ajouter un administrateur</p>
            </div>
        </Button>
    </div>
);

export default TableFooter;