const headerStyle = "px-6 py-4 text-xs font-UberMoveBold text-gray-500 uppercase tracking-wider bg-gray-50";

const TableHeader = () => (
    <thead>
        <tr>
            <th className={headerStyle}>Prénom</th>
            <th className={headerStyle}>Nom</th>
            <th className={headerStyle}>Email</th>
            <th className={`${headerStyle} text-center`}>Admin</th>
            <th className={`${headerStyle} text-center`}>Delete</th>
        </tr>
    </thead>
);

export default TableHeader;