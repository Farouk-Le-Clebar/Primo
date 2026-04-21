import { Trash2 } from "lucide-react";
import type { UserType } from "../../../../types/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAdminPermission } from "../../../../requests/admin";
import AddAdminModal from "./AddAdminModal";

type TableBodyProps = {
    userList: UserType[];
    addAdminModalOpen: boolean;
    setAddAdminModalOpen: (open: boolean) => void;
};

const cellStyle = "p-4 text-sm text-gray-800 bg-white";

const formatFrenchDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Europe/Paris",
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));

const TableBody = ({ userList, addAdminModalOpen, setAddAdminModalOpen }: TableBodyProps) => {
    const queryClient = useQueryClient();

    const {mutate: removeAdminPermissionToUser} = useMutation({
        mutationFn: (userId: string) => removeAdminPermission(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", "get", "admins"] });
        },
        onError: () => {
            console.error("Error removing admin permission");
        }
    });

    return (
        <>
            <tbody className="divide-y divide-gray-100">
                {userList.map((user) => (
                    <tr key={user.id} className="hover:bg-green-50 transition-colors duration-150">
                        <td className={`${cellStyle} font-UberMoveBold`}>{user.firstName}</td>
                        <td className={cellStyle}>{user.surName}</td>
                        <td className={cellStyle}>{user.email}</td>
                        <td className={cellStyle}>{formatFrenchDateTime(user.lastConnection)}</td>
                        <td className={`${cellStyle} text-center`}>
                            <button className="cursor-pointer" onClick={() => removeAdminPermissionToUser(user.id)}>
                                <Trash2 className="text-red-700 transition-transform transform hover:scale-105" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            {addAdminModalOpen && <AddAdminModal onClose={() => setAddAdminModalOpen(false)} />}
        </>
    );
};

export default TableBody;