import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Search from "./pages/search/Search";

function App() {
  const location = useLocation();

  const showNavbarOn = ["/"];

  const shouldShowNavbar = showNavbarOn.some((p) => {
    if (p === "/") return location.pathname === "/";
    return location.pathname === p || location.pathname.startsWith(p + "/");
  });

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      {shouldShowNavbar && <Footer />}
    </>
  );
}

export default App;