import { Outlet } from "react-router-dom";
import LogoPrimo from "../../assets/logos/logoPrimoBlack.svg";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="mb-12 flex items-center justify-center">
        <img src={LogoPrimo} alt="Primo Logo" className="h-[60px] w-[60px]" />
        <span className="font-ubermove font-medium text-5xl text-gray-900 tracking-tight">
          Primo
        </span>
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-116">
        <Outlet />
      </div>
    </div>
  );
}