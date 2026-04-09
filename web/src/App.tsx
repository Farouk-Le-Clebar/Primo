import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import Layout from "./components/layouts/layout";
import LayoutSettings from "./components/layouts/layoutSettings";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminRoute from "./components/adminRoute/AdminRoute";

// AUTH PAGES (Nouveaux imports)
import AuthLayout from "./pages/auth/AuthLayout";
import AuthRoot from "./pages/auth/AuthRoot";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";

// PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import Map from "./pages/map/Map";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/settings/editProfile/EditProfile";
import Notifications from "./pages/settings/Notifications";
import Billing from "./pages/settings/Billing";
import Privacy from "./pages/settings/Privacy";
import Security from "./pages/settings/Security";
import Subscriptions from "./pages/settings/Subscriptions";
import CustomToaster from "./components/toaster/CustomToaster";
import ProjectDetail from "./pages/projects/ProjectDetail";
import ProjectCreate from "./pages/projects/ProjectCreate";
import AdminPanel from "./pages/admin/AdminPanel";
import OnboardingRoot from "./pages/onBoarding/OnboardingRoot";
import EmailVerify from "./pages/emailVerify/EmailVerify";
import PostRegisterEmailVerify from "./pages/emailVerify/PostRegisterEmailVerify";

export default function App() {
  return (
    <>
      <CustomToaster />

      <Routes>
        <Route path="/verify" element={<EmailVerify />} />
        {/* Routes Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthRoot />} />
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="register/verify" element={<PostRegisterEmailVerify />} />
        </Route>

        {/* Routes Protegé */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingRoot />} />

          {/* Layout Principal */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<ProjectCreate />} />
            <Route path="projects/:id" element={<ProjectDetail />} />

            {/* Routes Admin */}
            <Route path="admin" element={<AdminRoute />}>
              <Route path="dashboard" element={<AdminPanel />} />
            </Route>
          </Route>

          {/* Route Carte (Plein écran, hors Layout standard j'imagine) */}
          <Route path="/search" element={<Map />} />

          {/* Layout Settings */}
          <Route path="/" element={<LayoutSettings />}>
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Navigate to="/settings/edit-profile" replace />} />
            <Route path="settings/edit-profile" element={<EditProfile />} />
            <Route path="settings/notifications" element={<Notifications />} />
            <Route path="settings/billing" element={<Billing />} />
            <Route path="settings/privacy" element={<Privacy />} />
            <Route path="settings/security" element={<Security />} />
            <Route path="settings/subscriptions" element={<Subscriptions />} />
          </Route>

        </Route>

        {/* Fallback 404 - Redirige vers le dashboard (qui redirigera vers /auth si non connecté) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}