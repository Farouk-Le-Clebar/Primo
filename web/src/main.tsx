import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import App from './App.tsx'
import "./index.css";
import { AuthModalProvider } from "./context/AuthModalProvider";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = "43730285685-g8mns49ja7c2ndo8mbm0d95fduse0sfb.apps.googleusercontent.com"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthModalProvider>
            <ThemeProvider defaultTheme="system" storageKey="primo-theme">
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </AuthModalProvider>
        </GoogleOAuthProvider>
    </QueryClientProvider>
);