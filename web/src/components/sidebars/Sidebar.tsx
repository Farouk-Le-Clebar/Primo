// COMPONENTS
import CustomNavLink from "../../ui/Navlink";

// ICONS
import { SquareDashedKanban, LayoutDashboard, Heart, Map, Bot, HelpCircle } from "lucide-react";

export default function Sidebar() {
  return (
    <nav className="flex flex-col h-full w-full w-full">
      <div className="flex-1 flex flex-col gap-8 p-4 overflow-y-auto">
        
        <section className="flex flex-col gap-1">
          <h3 className="px-2 text-[11px] font-UberMove uppercase tracking-[0.1em] text-[#757575] mb-2">
            Principale
          </h3>
          <div className="space-y-1">
            <CustomNavLink 
              to="/dashboard" 
              label="Dashboard" 
              icon={<LayoutDashboard size={20} />} 
              className="h-10"
            />
            <CustomNavLink 
              to="/projects" 
              label="Projets" 
              icon={<SquareDashedKanban size={20} />} 
              className="h-10"
            />
            
            <CustomNavLink 
              to="/favorites" 
              label="Favoris" 
              icon={<Heart size={20} />} 
              className="h-10"
            />
            
            <CustomNavLink 
              to="/search" 
              label="Carte" 
              icon={<Map size={20} />} 
              className="h-10"
            />
          </div>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="px-2 text-[11px] font-UberMove uppercase tracking-[0.1em] text-[#757575] mb-2">
            Recherche intelligente
          </h3>
          <div className="space-y-1">
             <div className="group relative">
                <CustomNavLink 
                  to="/ai-search" 
                  label="IA Primo" 
                  icon={<Bot size={20} className="text-emerald-600" />} 
                  className="h-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
             </div>
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