import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";

// PAGES imports
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import SearchMap from "./pages/search-map/SearchMap";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />  {/* / */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="search" element={<SearchMap />} />
      </Route>
    </Routes>
  );
}
