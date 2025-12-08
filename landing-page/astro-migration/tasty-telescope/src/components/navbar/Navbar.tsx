import Logo from "../../assets/logos/logoPrimoBlack.svg?url";

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4 gap-85">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-7 w-7" />
            <span className="text-xl text-gray-800 font-medium">Primo.</span>
          </div>

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
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-green-600 transition-colors"
            >
              À propos
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
