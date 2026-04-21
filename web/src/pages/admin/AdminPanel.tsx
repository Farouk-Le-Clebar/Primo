import AdminList from "./components/AdminList/AdminList";
import UsersList from "./components/UsersList/UsersList";

const AdminPanel = () => {

    return (
        <div className="flex flex-col w-full h-full p-10 gap-5 overflow-y-scroll">
            <UsersList />
            <AdminList />
        </div>
    );
};

export default AdminPanel;