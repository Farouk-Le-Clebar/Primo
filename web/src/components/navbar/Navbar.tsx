import { useState } from "react";
import Logo from "../../assets/logos/logoPrimoBlack.svg";
import LoginModal from "./component/LoginModal";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md p-6 flex items-center justify-center gap-85">
        <div className="flex items-center gap-1">
          <img src={Logo} alt="Logo" className="h-7 w-7" />
          <span className="text-xl text-gray-800 UberMoveMedium">Primo.</span>
        </div>

        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-green-600 UberMoveMedium">Accueil</a>
          <a href="#" className="hover:text-green-600 UberMoveMedium">À propos</a>
          <a href="#" className="hover:text-green-600 UberMoveMedium">Fonctionnalités</a>
          <a href="#" className="hover:text-green-600 UberMoveMedium">Services</a>
        </div>

        <div className="flex gap-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-6 py-1.5 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Se connecter
          </button>
        </div>
      </nav>

      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
