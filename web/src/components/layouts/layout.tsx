import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebars/Sidebar";

export default function Layout() {
  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-[#F7F7FA]">
      {/* 1. NAVBAR : Prend toute la largeur en haut */}
      <header className="relative z-20 w-full h-20 flex items-center bg-white border-b border-gray-200">
        <Navbar />
      </header>

      {/* 2. CONTAINER INFERIEUR : Sidebar + Content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* SIDEBAR : Commence sous la navbar et s'arrête en bas */}
        <aside className="w-[17%] h-full bg-white border-r border-gray-200 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* PAGE CONTENT : Zone principale de contenu */}
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}