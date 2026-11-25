import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.tsx'
import "./index.css";
import { AuthModalProvider } from "./context/AuthModalProvider";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { registerServiceWorker } from "./utils/serviceWorker";
import { GOOGLE_CLIENT_ID } from "./constants/google";

registerServiceWorker();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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