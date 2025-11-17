import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import backgroundWhite from "../../assets/backgrounds/backgroundWhite.svg"

export default function Layout() {
  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* IMAGE background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${backgroundWhite})`,
        }}
      ></div>

      {/* DIV sidebar */}
      <aside className="relative z-10 w-70 text-white h-full">
        <Sidebar />
      </aside>

      <div className="relative z-10 flex flex-col flex-1 h-full">

        {/* DIV navbar */}
        <header className="h-32 flex items-center">
          <Navbar />
        </header>

        {/* DIV page */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
