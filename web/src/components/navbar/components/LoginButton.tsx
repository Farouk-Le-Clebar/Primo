import { motion } from "framer-motion";
import { CornerDownRight } from "lucide-react";
import { useAuthModal } from "../../../hooks/useAuthModal";
import Button from "../../../ui/Button";

export default function LoginButton() {
  const { openAuthModal } = useAuthModal();

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={openAuthModal}
        className="bg-[#388160] hover:bg-[#2d664c] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-green-900/10"
      >
        <span className="font-UberMove text-sm font-medium">Se connecter</span>
        <CornerDownRight size={16} className="opacity-70" />
      </Button>
    </motion.div>
  );
}