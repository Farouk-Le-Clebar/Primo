import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx'
import "./index.css";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { AuthModalProvider } from "./context/AuthModalProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthModalProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthModalProvider>
      </Provider>
    </QueryClientProvider>
);
