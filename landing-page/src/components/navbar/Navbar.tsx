import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../../assets/logos/logoPrimoBlack.svg?url";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);

    if (window.location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4 gap-85">
          <a href="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-7 w-7" />
            <span className="text-xl text-gray-800 font-medium">Primo.</span>
          </a>

          <div className="hidden md:flex items-center gap-8 w-full">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Services
            </button>
            <a
              href="/blog"
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              Blog
            </a>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              À propos
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="flex flex-col px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-700 hover:text-green-600 transition-colors text-left py-2"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-700 hover:text-green-600 transition-colors text-left py-2"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-700 hover:text-green-600 transition-colors text-left py-2"
              >
                Services
              </button>
              <a
                href="/blog"
                className="text-gray-700 hover:text-green-600 transition-colors text-left py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-green-600 transition-colors text-left py-2"
              >
                À propos
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
