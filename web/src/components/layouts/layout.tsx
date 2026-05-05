import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../sidebars/Sidebar";
import Navbar from "../navbar/Navbar"; 
import AnimatedPrimoLogo from "../animations/AnimatedPrimoLogo";

export default function Layout() {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(location.state?.welcome || false);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <>
      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAFAFA]">
          <AnimatedPrimoLogo className="h-[80px] w-[80px]" />
        </div>
      )}

      <div className="relative h-screen flex bg-[#FAFAFA]">
        
        {/* CORRECTION 1 : On passe la sidebar en z-50 pour s'assurer qu'elle domine tout le reste de l'écran */}
        <aside className="h-full flex-shrink-0 z-50 relative w-64">
          <Sidebar/>
        </aside>

        {/* CORRECTION 2 : On ajoute 'relative z-10' ici pour forcer ce bloc à rester en dessous de la sidebar (z-50) */}
        <div className="flex-1 flex flex-col pt-2 relative z-10">
          
          <div className="flex-1 flex flex-col bg-white rounded-tl-2xl shadow-sm border border-gray-100 overflow-hidden">            
            <header className="w-full h-14 flex items-center px-2 z-20 relative">
              <Navbar />
            </header>
            <main className="flex-1 overflow-y-auto relative z-0">
              <Outlet />
            </main>
          </div>
          
        </div>
      </div>
    </>
  );
}