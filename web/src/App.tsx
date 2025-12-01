import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";

import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Map from "./pages/newMap/Map";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />  {/* / */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
      </Route>
      <Route path="search" element={<Map />} />
    </Routes>
  );
}
