import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// COMPONENTS
import Layout from "./components/layouts/layout";
import LayoutSettings from "./components/layouts/layoutSettings";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// PUBLIC PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Map from "./pages/newMap/Map";

// PROTECTED PAGES
import Profile from "./pages/profile/Profile";

import EditProfile from "./pages/settings/EditProfile";
import Notifications from "./pages/settings/Notifications";
import Billing from "./pages/settings/billing";
import Privacy from "./pages/settings/Privacy";
import Security from "./pages/settings/security";
import Subscriptions from "./pages/settings/Subscriptions";

export default function App() {
  return (
    <>
      {/* Toaster pour les notifications */}
      <Toaster position="top-right" reverseOrder={false}toastOptions={{
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
        </Route>

        {/* Routes Protégées (Redirigent vers / si pas connecté) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LayoutSettings />}>
            <Route path="profile" element={<Profile />} />

            {/* Routes de paramètres */}
            <Route path="settings" element={<EditProfile />} />
            <Route path="settings/edit-profile" element={<EditProfile />} />
            <Route path="settings/notifications" element={<Notifications />} />
            <Route path="settings/billing" element={<Billing />} />
            <Route path="settings/privacy" element={<Privacy />} />
            <Route path="settings/security" element={<Security />} />
            <Route path="settings/subscriptions" element={<Subscriptions />} />
          </Route>

        </Route>

        {/* Routes publiques sans layout */}
        <Route path="search" element={<Map />} />

        {/* Catch-all redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}