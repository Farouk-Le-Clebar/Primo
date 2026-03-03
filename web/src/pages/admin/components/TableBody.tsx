import type { UserType } from "../../../types/admin";

type TableBodyProps = {
    userList: UserType[];
};

const cellStyle = "px-6 py-4 text-sm text-gray-800 bg-white";

const TableBody = ({ userList }: TableBodyProps) => (
    <tbody className="divide-y divide-gray-100">
        {userList.map((user) => (
            <tr key={user.id} className="hover:bg-green-50 transition-colors duration-150">
                <td className={`${cellStyle} font-UberMoveBold`}>{user.firstName}</td>
                <td className={cellStyle}>{user.surName}</td>
                <td className={cellStyle}>{user.email}</td>
                <td className={`${cellStyle} text-center`}>
                    <span className={`px-3 py-1 rounded-full text-xs font-UberMoveBold ${user.isAdmin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {user.isAdmin ? "Oui" : "Non"}
                    </span>
                </td>
            </tr>
        ))}
    </tbody>
);

export default TableBody;