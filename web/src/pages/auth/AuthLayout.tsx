import { Outlet, useLocation } from "react-router-dom";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg";

export default function AuthLayout() {
  const location = useLocation();

  const isAuthRoot = location.pathname === "/auth" || location.pathname === "/auth/";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="mb-12 flex flex-col items-center justify-center text-center">
        {isAuthRoot ? (
          <>
            <img src={LogoPrimo} alt="Primo Logo" className="h-[60px] w-[60px] mb-4 dark:invert" />
            <h1 className="font-ubermove font-medium text-4xl sm:text-5xl text-gray-900 tracking-tight mb-3 dark:text-white">
              Bienvenue sur Primo
            </h1>
            <p className="font-inter text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-md">
              Le moteur de recherche cadastral intelligent par excellence.
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <img src={LogoPrimo} alt="Primo Logo" className="h-[60px] w-[60px] dark:invert" />
            <span className="font-ubermove font-medium text-5xl text-gray-900 tracking-tight dark:text-white">
              Primo
            </span>
          </div>
        )}
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-116">
        <Outlet />
      </div>
    </div>
  );
}