import { useState } from "react";
import type { UserType } from "../../../types/admin";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableFooter from "./TableFooter";

type UsersListTableProps = {
    userList: UserType[];
    fromTo: { from: number; to: number };
    setFromTo: (from: number, to: number) => void;
}

const UsersListTable = ({ userList, fromTo, setFromTo }: UsersListTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleNext = () => {
        setFromTo(fromTo.from + 10, fromTo.to + 10);
        setCurrentPage(currentPage + 1);
    };

    const handlePrevious = () => {
        if (fromTo.from !== 0 && fromTo.to > 10) {
            setFromTo(fromTo.from - 10, fromTo.to - 10);
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-UberMove">
                    <TableHeader />
                    <TableBody userList={userList} />
                </table>
            </div>
            <TableFooter
                currentPage={currentPage}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                canNext={userList.length === itemsPerPage}
            />
        </div>
    );
};

export default UsersListTable;