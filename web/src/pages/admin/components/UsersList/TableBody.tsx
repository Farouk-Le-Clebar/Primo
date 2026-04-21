import { Trash2 } from "lucide-react";
import type { UserType } from "../../../../types/admin";
import DeleteModal from "./DeleteModal";
import { useState } from "react";

type TableBodyProps = {
    userList: UserType[];
};

const cellStyle = "px-6 py-4 text-sm text-gray-800 bg-white";

const formatFrenchDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Europe/Paris",
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));

const TableBody = ({ userList }: TableBodyProps) => {
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteUser = (userId: string, email: string) => {
        setUserToDelete(userId);
        setEmailToDelete(email);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setUserToDelete(null);
        setEmailToDelete(null);
        setIsDeleteModalOpen(false);
    }

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
                            <button className="cursor-pointer" onClick={() => handleDeleteUser(user.id, user.email)}>
                                <Trash2 className="text-red-700 transition-transform transform hover:scale-105" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            {isDeleteModalOpen && userToDelete && emailToDelete && (
                <DeleteModal
                    userId={userToDelete}
                    email={emailToDelete}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </>
    );
};

export default TableBody;