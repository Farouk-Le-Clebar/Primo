import SearchingBar from "../search/SearchBar";
import { Ellipsis, Settings } from 'lucide-react';
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const getPageName = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "Home";
    const page = parts[parts.length - 1];
    return page.charAt(0).toUpperCase() + page.slice(1);
  };

  const pageName = getPageName(location.pathname);

  return (
    <nav className="flex w-full h-full items-center">
      {/* DIV search bar */}
      <div className="flex h-full items-center justify-start w-[75%] gap-10">
        <div className="flex flex-col h-full w-35 justify-center">
          <p className="text-xs text-white font-lg">Pages  / {pageName}</p>
          <p className="text-xs text-white font-lg">{pageName}</p>
        </div>
        <div className="flex w-xl h-full items-center">
          <SearchingBar />
        </div>
      </div>

      {/* DIV accound and buttons right  */}
      <div className="flex h-full w-[26%] items-center justify-start">
        <div className="flex h-full w-[70%] items-center justify-end gap-5">
          <button className="text-white h-8 w-8 hover:bg-white hover:text-black transition justify-center items-center flex rounded-lg">
            <Ellipsis size={20} />
          </button>
          <button className="text-white h-8 w-8 hover:bg-white hover:text-black transition justify-center items-center flex rounded-lg">
            FR
          </button>
          <button className="text-white h-8 w-8 hover:bg-white hover:text-black transition justify-center items-center flex rounded-lg">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
