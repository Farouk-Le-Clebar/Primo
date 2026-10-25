import { useCallback } from "react";
import { ROUTES } from "../../constants/routes";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MapPanel from "../map/components/layers/Navbar/MapPanel";
import { FEEDBACK_PANEL_ID } from "../map/components/layers/Navbar/panelIds";
import { useFeedbackForm } from "../../hooks/useFeedbackForm";
import FeedbackIntro from "./components/FeedbackIntro";
import FeedbackComposer from "./components/FeedbackComposer";
import FeedbackSent from "./components/FeedbackSent";

export default function FeedbackPanel() {
  const navigate = useNavigate();
  const handleClose = useCallback(() => navigate(ROUTES.map), [navigate]);
  const form = useFeedbackForm();

  return (
    <MapPanel id={FEEDBACK_PANEL_ID} label="Retours et suggestions" onClose={handleClose}>
      <div className="scrollbar-glass @container min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid min-h-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-10 @4xl:grid-cols-[2fr_3fr] @4xl:px-12">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
            <FeedbackIntro />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
            className="glass overflow-hidden rounded-2xl border border-black/5 shadow-xl dark:border-white/10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={form.isSent ? "sent" : "composer"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {form.isSent ? <FeedbackSent onReset={form.reset} /> : <FeedbackComposer form={form} />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </MapPanel>
  );
}
