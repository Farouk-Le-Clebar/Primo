import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../../assets/logos/logoPrimoBlack.svg?url';
import { NAV_ITEMS } from '../../config/constants';

// Navbar of the secondary pages (blog, legal…): links back to the landing sections.
const LINKS = [
  ...NAV_ITEMS.map((item) => ({ href: `/#${item.id}`, label: item.label })),
  { href: '/blog/', label: 'Blog' },
  { href: '/a-propos/', label: 'À propos' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const linkClass = 'text-gray-700 hover:text-green-600 transition-colors';

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-sm"
      aria-label="Navigation principale"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4 gap-85">
        <a href="/" className="flex items-center gap-2">
          <img src={Logo} alt="" className="h-7 w-7" width={28} height={28} />
          <span className="text-xl text-gray-800 font-medium">Primo</span>
        </a>

        <div className="hidden md:flex items-center gap-8 w-full">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden ${linkClass}`}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-mobile"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="navbar-mobile" className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${linkClass} py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
