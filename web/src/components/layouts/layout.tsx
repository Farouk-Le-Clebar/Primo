import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../sidebars/Sidebar";
import Navbar from "../navbar/Navbar";
import AnimatedPrimoLogo from "../animations/AnimatedPrimoLogo";
import { SIDEBAR_WIDTHS } from "./config/sidebar.config";

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(false);
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <AnimatedPrimoLogo className="h-[80px] w-[80px]" />
        </div>
      )}

      <div className="relative h-screen flex overflow-hidden bg-[#F7F7FA]">
        
        <aside 
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={`h-full bg-white border-r border-gray-200 flex-shrink-0 z-30 relative transition-all duration-300 ease-in-out ${
            isExpanded ? SIDEBAR_WIDTHS.expanded : SIDEBAR_WIDTHS.collapsed
          }`}
        >
          <Sidebar isExpanded={isExpanded} />
        </aside>

        <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
          <header className="w-full h-14 flex items-center bg-white border-b border-gray-200 z-20 relative">
            <Navbar />
          </header>

          <main className="flex-1 overflow-y-auto relative">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}