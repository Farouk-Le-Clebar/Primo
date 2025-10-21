import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logos/logoPrimoBlack.svg";
import AuthEntryModal from "./component/AuthEntryModal";
import RegisterModal from "./component/RegisterModal";
import LoginModal from "./component/LoginModal";

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<"auth" | "login" | "register" | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const openModal = (modal: "auth" | "login" | "register") => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-7 w-7" />
            <span className="text-xl text-gray-800 font-medium">Primo.</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Accueil</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">À propos</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Fonctionnalités</a>
            <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Services</a>
          </div>

          <div className="hidden md:flex">
            <button
              onClick={() => openModal("auth")}
              className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200"
            >
              Se connecter
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center text-gray-800"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-200">
            <div className="flex flex-col items-center gap-4 py-4">
              <a href="#" className="text-gray-700 hover:text-green-600">Accueil</a>
              <a href="#" className="text-gray-700 hover:text-green-600">À propos</a>
              <a href="#" className="text-gray-700 hover:text-green-600">Fonctionnalités</a>
              <a href="#" className="text-gray-700 hover:text-green-600">Services</a>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openModal("auth");
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Gestion dynamique des modals --- */}
      {activeModal === "auth" && (
        <AuthEntryModal
          onClose={closeModal}
          setEmail={setEmail}
          onEmailChecked={(exists) => {
            closeModal();
            setActiveModal(exists ? "login" : "register");
          }}
        />
      )}

      {activeModal === "login" && <LoginModal email={email} onClose={closeModal} />}
      {activeModal === "register" && <RegisterModal email={email} onClose={closeModal} />}
    </>
  );
}
