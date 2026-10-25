import { AnimatePresence, motion } from "framer-motion";
import PrimoSplash from "../../../../../components/animations/PrimoSplash";

type MapSplashLoaderProps = {
  isVisible: boolean;
};

export default function MapSplashLoader({ isVisible }: MapSplashLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="map-splash"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]"
        >
          <PrimoSplash label="Préparation de la carte" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
