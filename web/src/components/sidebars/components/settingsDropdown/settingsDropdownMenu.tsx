import CustomNavLink from "../../../../ui/Navlink";

interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const dropdownBtnStyle = "w-[90%] mx-auto h-8 py-2 border border-transparent";

  return (
    <div className="absolute w-52 bg-white rounded-xl shadow-xl border border-[#E6E7EB] py-2 px-2 z-50 transform origin-top-right flex flex-col gap-1">
      <CustomNavLink
        to="/profile"
        label="Mon profil"
        showChevronOnHover={true}
        textColor="text-[#000000]"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        onClick={onClose}
        iconColor="text-gray-500"
        
      />

      <CustomNavLink
        to="/settings/edit-profile"
        label="Paramètres"
        showChevronOnHover={true}
        textColor="text-[#000000]"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        onClick={onClose}
        iconColor="text-gray-500"
      />

      <div className="my-1 border-t border-gray-100" />

      <CustomNavLink
        label="Déconnexion"
        showChevronOnHover={true}
        textColor="text-[#000000]"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        onClick={handleLogout}
      />
    </div>
  );
}