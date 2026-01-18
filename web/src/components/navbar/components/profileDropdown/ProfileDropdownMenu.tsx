import { useDispatch } from "react-redux";

// COMPONENTS & ICONS
import { clearUser } from "../../../../store/userSlice";
import UserProfile from "../../../user/UserProfile";
import CustomNavLink from "../../../../ui/Navlink";

// ICONS
import { User, Settings, LogOut } from "lucide-react";

interface DropdownMenuProps {
  user: any;
  onClose: () => void;
}

export default function DropdownMenu({ user, onClose }: DropdownMenuProps) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    window.location.reload();
  };

  const dropdownBtnStyle = "w-[95%] mx-auto h-auto py-2 border border-transparent";

  return (
    <div className="absolute right-[-10px] mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E6E7EB] py-2 z-50 transform origin-top-right flex flex-col gap-1">
      
      <div className="px-4 py-3 border-b border-gray-50 mb-1">
        <UserProfile user={user} />
      </div>

      <CustomNavLink
        to="/profile"
        label="Mon profil"
        icon={<User size={18} />}
        showChevronOnHover={true}
        gap="gap-3"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        onClick={onClose}
        iconColor="text-gray-500"
      />

      <CustomNavLink
        to="/settings/edit-profile"
        label="Paramètres"
        icon={<Settings size={18} />}
        showChevronOnHover={true}
        gap="gap-3"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        onClick={onClose}
        iconColor="text-gray-500"
      />

      <div className="my-1 border-t border-gray-100" />

      <CustomNavLink
        label="Déconnexion"
        icon={<LogOut size={18} />}
        variant="danger"
        showChevronOnHover={true}
        gap="gap-3"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        onClick={handleLogout}
      />
    </div>
  );
}