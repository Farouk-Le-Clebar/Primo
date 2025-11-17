import { createContext } from "react";

export interface AuthModalContextType {
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);
