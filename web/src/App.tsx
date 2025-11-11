import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchMap from "./pages/search-map/SearchMap";

function App() {
  const location = useLocation();

  const showNavbarOn = ["/"];

  const shouldShowNavbar = showNavbarOn.some((p) => {
    if (p === "/") return location.pathname === "/";
    return location.pathname === p || location.pathname.startsWith(p + "/");
  });

  const queryClient = new QueryClient();

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchMap />} />
        </Routes>
      </QueryClientProvider>
      {shouldShowNavbar && <Footer />}
    </>
  );
}

export default App;
