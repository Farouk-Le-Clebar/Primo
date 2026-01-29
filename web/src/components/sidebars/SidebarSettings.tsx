// COMPONENTS
import CustomNavLink from "../../ui/Navlink";

// ICONS
import { CircleUser, UserPen, BookOpenText, CreditCard, CalendarDays, ShieldEllipsis, Bell, HelpCircle } from "lucide-react";

export default function SidebarSettings() {
  return (
    <nav className="flex flex-col h-full w-full w-full">
      <div className="flex-1 flex flex-col gap-8 p-4 overflow-y-auto">
        
        {/* Section Principale */}
        <section className="flex flex-col gap-1">
          <h3 className="px-2 text-[11px] font-UberMove uppercase tracking-[0.1em] text-[#757575] mb-2">
            Paramètres
          </h3>
          <div className="space-y-1">
            {/* Page du profil utilisateur */}
            <CustomNavLink 
              to="/profile"
              label="Mon compte" 
              icon={<CircleUser size={20} />} 
              className="h-10"
            />

            {/* Page de modification du profil */}
            <CustomNavLink 
              to="/settings/edit-profile"
              label="Modifier le profil"
              icon={<UserPen size={20} />}
              className="h-10"
            />

            {/* Page des Données et confidentialité */}
            <CustomNavLink 
              to="/settings/privacy" 
              label="Données et confidentialité" 
              icon={<BookOpenText size={20} />} 
              className="h-10"
            />
            
            {/* Page des abonnements */}
            <CustomNavLink 
              to="/settings/subscriptions" 
              label="Abonnements" 
              icon={<CalendarDays size={20} />} 
              className="h-10"
            />

            {/* Page des Facturations */}
            <CustomNavLink
              to="/settings/billing"
              label="Facturation"
              icon={<CreditCard size={20} />}
              className="h-10"
            />

            {/* Page des Securité */}
            <CustomNavLink
              to="/settings/security"
              label="Sécurité"
              icon={<ShieldEllipsis size={20} />}
              className="h-10"
            />

            {/* Page des Notifications */}
            <CustomNavLink
              to="/settings/notifications"
              label="Notifications"
              icon={<Bell size={20} />}
              className="h-10"
            />
          </div>
        </section>
      </div>

      <div className="p-4 mt-auto flex flex-col gap-1">
        <CustomNavLink 
          to="/help" 
          label="Centre d'aide" 
          icon={<HelpCircle size={20} />} 
          className="h-10"
        />
      </div>
    </nav>
  );
}