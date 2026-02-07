import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import Layout from "./components/layouts/layout";
import LayoutSettings from "./components/layouts/layoutSettings";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// PUBLIC PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Map from "./pages/map/Map";

// PROTECTED PAGES
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/settings/editProfile/EditProfile";
import Notifications from "./pages/settings/Notifications";
import Billing from "./pages/settings/Billing";
import Privacy from "./pages/settings/Privacy";
import Security from "./pages/settings/Security";
import Subscriptions from "./pages/settings/Subscriptions";
import CustomToaster from "./components/toaster/CustomToaster";
import ProjectDetailPage from "./pages/projects/ProjectDetail";

export default function App() {
  return (
    <>
      {/* Toaster pour les notifications */}
      <CustomToaster />

      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
        </Route>

        {/* Routes de la carte */}
        <Route path="search" element={<Map />} />

        {/* Routes Protégées */}
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

        {/* Redirection pour les routes non trouvées */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}