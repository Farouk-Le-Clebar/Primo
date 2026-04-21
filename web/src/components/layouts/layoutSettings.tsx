import { Outlet } from "react-router-dom";
import NavbarSettings from "../navbar/NavbarSettings";
import SidebarSettings from "../sidebars/SidebarSettings";

export default function LayoutSettings() {
  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-[#F7F7FA]">
      <header className="relative z-20 w-full h-20 flex items-center bg-white border-b border-gray-200">
        <NavbarSettings />
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">

        <aside className="w-[17%] h-full bg-white border-r border-gray-200 flex-shrink-0">
          <SidebarSettings />
        </aside>

        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}