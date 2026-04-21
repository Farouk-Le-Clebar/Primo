import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { getAdmins } from "../../../../requests/admin";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";

const AdminList = () => {
    const [isDeployed, setIsDeployed] = useState(false);
    const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["users", "get", "admins"],
        queryFn: () => getAdmins(),
    })

    const handleToggle = () => {
        setIsDeployed(!isDeployed);
    };

    const handleAddAdminModalOpen = (open: boolean) => {
        setAddAdminModalOpen(open);
    }

    return (
        <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100  ${isDeployed ? "flex-1 overflow-y-auto" : "h-auto"}`}>
            <button
                onClick={handleToggle}
                className={`w-full flex justify-between items-center p-5 transition-colors ${isDeployed ? "bg-gray-50/50" : "hover:bg-gray-50"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">Liste des administrateurs</span>
                </div>
                <ChevronRight
                    className={`text-gray-400 transition-transform duration-200 ${isDeployed ? "rotate-90" : ""}`}
                />
            </button>

            {isDeployed && (
                <div className="p-5 pt-0 border-t border-gray-50">
                    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse font-UberMove">
                                <TableHeader />
                                <TableBody
                                    userList={data}
                                    addAdminModalOpen={addAdminModalOpen}
                                    setAddAdminModalOpen={handleAddAdminModalOpen}
                                />
                            </table>
                        </div>
                        <TableFooter onAddAdmin={() => handleAddAdminModalOpen(true)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminList;