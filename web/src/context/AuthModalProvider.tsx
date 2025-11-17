import { useState } from "react";
import type { ReactNode } from "react";
import { AuthModalContext } from "./AuthModalContext";

import AuthEntryModal from "../components/auth/AuthEntryModal";
import LoginModal from "../components/auth/LoginModal";
import RegisterModal from "../components/auth/RegisterModal";

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<"auth" | "login" | "register" | null>(null);
  const [email, setEmail] = useState("");

  const openAuthModal = () => setActiveModal("auth");
  const closeAuthModal = () => setActiveModal(null);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}

      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          {activeModal === "auth" && (
            <AuthEntryModal
              onClose={closeAuthModal}
              setEmail={setEmail}
              onEmailChecked={(exists) => {
                setActiveModal(exists ? "login" : "register");
              }}
            />
          )}
          {activeModal === "login" && (
            <LoginModal
              onClose={closeAuthModal}
              email={email}
              onBack={() => setActiveModal("auth")}
            />
          )}
          {activeModal === "register" && (
            <RegisterModal
              onClose={closeAuthModal}
              email={email}
              onBack={() => setActiveModal("auth")}
            />
          )}
        </div>
      )}
    </AuthModalContext.Provider>
  );
};