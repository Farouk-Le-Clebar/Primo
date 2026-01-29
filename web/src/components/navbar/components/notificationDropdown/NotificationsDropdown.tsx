import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger : La Cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all group"
      >
        <Bell size={20} className={`transition-transform ${isOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
        {hasNotifications && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Menu des Notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-[120] overflow-hidden"
          >
            <div className="p-4 border-b border-gray-50">
              <h3 className="font-UberMoveBold text-gray-800">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {/* Simulation de notification */}
              <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <p className="text-sm font-UberMoveMedium text-gray-800">Nouveau projet disponible</p>
                <p className="text-xs text-gray-400 mt-1">Il y a 2 minutes</p>
              </div>
              <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                <p className="text-sm font-UberMoveMedium text-gray-800">Bienvenue sur Primo !</p>
                <p className="text-xs text-gray-400 mt-1">Il y a 1 heure</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <button className="text-xs font-UberMoveBold text-[#388160] hover:underline">
                Tout marquer comme lu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}