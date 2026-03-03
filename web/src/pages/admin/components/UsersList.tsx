import { useMutation } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { getUsers } from "../../../requests/admin";
import type { UserType } from "../../../types/admin";
import UsersListTable from "./UsersListTable";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const UsersList = () => {
    const [isDeployed, setIsDeployed] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [fromTo, setFromTo] = useState({ from: 0, to: 10 });
    const navigate = useNavigate();

    const { mutate: mutateUsers, isPending } = useMutation<UserType[], Error, { from: number, to: number }>({
        mutationFn: ({ from, to }) => getUsers(from, to),
        onSuccess: (data) => {
            setUsers(data);
        },
        onError: (error) => {
            toast.error("Accès refusé : droits administrateur requis.", {
                id: "admin-error",
            });
            navigate("/");
        }
    });

    const handleToggle = () => {
        const nextState = !isDeployed;
        setIsDeployed(nextState);
        if (nextState && users.length === 0) {
            mutateUsers({ from: fromTo.from, to: fromTo.to });
        }
    }

    const handleSetFromTo = (from: number, to: number) => {
        setFromTo({ from, to });
        mutateUsers({ from, to });
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
                onClick={handleToggle}
                className={`w-full flex justify-between items-center p-5 transition-colors ${isDeployed ? "bg-gray-50/50" : "hover:bg-gray-50"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">Liste des utilisateurs</span>
                    {isPending && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                </div>
                <ChevronRight
                    className={`text-gray-400 transition-transform duration-200 ${isDeployed ? "rotate-90" : ""}`}
                />
            </button>

            {isDeployed && (
                <div className="p-5 pt-0 border-t border-gray-50">
                    <div className="mt-4">
                        <UsersListTable
                            userList={users}
                            fromTo={fromTo}
                            setFromTo={handleSetFromTo}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersList;