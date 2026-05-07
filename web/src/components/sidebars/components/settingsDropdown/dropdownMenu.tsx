import CustomNavLink from "../../../../ui/Navlink";

// COMPONENTS
import UserProfileDropdown from "./userProfileDropdown";

// ICONS
import LogoutIcon from "../../../../assets/icons/logout.svg?react";
import SettingsIcon from "../../../../assets/icons/settings.svg?react";
import BillingIcon from "../../../../assets/icons/billing.svg?react";
import AccountIcon from "../../../../assets/icons/account.svg?react";
import UpgradeIcon from "../../../../assets/icons/upgrade.svg?react";


interface DropdownMenuProps {
  onClose: () => void;
}

export default function DropdownMenu({ onClose }: DropdownMenuProps) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const renderIcon = (IconComponent: React.FC<React.SVGProps<SVGSVGElement>>) => (
    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
      <IconComponent className="w-full h-full" />
    </div>
  );

  const dropdownBtnStyle = "w-full mx-auto h-8 py-2 border border-transparent";

  return (
    <div className="w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 px-0.5 flex flex-col gap-1">
      
      <div className="px-2 py-1 ">
        <UserProfileDropdown />
      </div>

      <div className="-mx-2 border-t border-gray-100" />

      <CustomNavLink
        to="/profile"
        label="Passer en Pro"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(UpgradeIcon)} 
        onClick={onClose}
      />

      <div className="-mx-2 border-t border-gray-100" />

      <CustomNavLink
        to="/profile"
        label="Profil"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(AccountIcon)} 
        onClick={onClose}
      />

      <CustomNavLink
        to="/settings/edit-profile"
        label="Paramètres"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(SettingsIcon)} 
        onClick={onClose}
      />
  
      <CustomNavLink
        to="/settings/edit-profile"
        label="Factures"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black"
        rounded="rounded-lg"
        className={dropdownBtnStyle}
        icon={renderIcon(BillingIcon)}
        onClick={onClose}
      />

      <div className="-mx-2 border-t border-gray-100" />

      <CustomNavLink
        label="Déconnexion"
        textClass="font-inter font-medium text-xs"
        showChevronOnHover={true}
        textColor="text-black"
        rounded="rounded-lg"
        icon={renderIcon(LogoutIcon)} 
        className={dropdownBtnStyle}
        onClick={handleLogout}
      />
    </div>
  );
}