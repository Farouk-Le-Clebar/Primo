import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import Layout from "./components/layouts/layout";
import LayoutSettings from "./components/layouts/layoutSettings";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminRoute from "./components/adminRoute/AdminRoute";
import CustomToaster from "./components/toaster/CustomToaster";

import { lazyPage } from "./components/lazyPage/lazyPage";
import Map from "./pages/map/Map";

const AuthLayout = lazyPage(() => import("./pages/auth/AuthLayout"));
const AuthRoot = lazyPage(() => import("./pages/auth/AuthRoot"));
const AuthLogin = lazyPage(() => import("./pages/auth/AuthLogin"));
const AuthRegister = lazyPage(() => import("./pages/auth/AuthRegister"));
const Dashboard = lazyPage(() => import("./pages/dashboard/Dashboard"));
const Projects = lazyPage(() => import("./pages/projects/Projects"));
const Profile = lazyPage(() => import("./pages/profile/Profile"));
const EditProfile = lazyPage(() => import("./pages/settings/editProfile/EditProfile"));
const Notifications = lazyPage(() => import("./pages/settings/Notifications"));
const Billing = lazyPage(() => import("./pages/settings/Billing"));
const Privacy = lazyPage(() => import("./pages/settings/Privacy"));
const Security = lazyPage(() => import("./pages/settings/Security"));
const Subscriptions = lazyPage(() => import("./pages/settings/Subscriptions"));
const AdminPanel = lazyPage(() => import("./pages/admin/AdminPanel"));
const UserProfile = lazyPage(() => import("./pages/admin/components/UsersList/UserProfile/UserProfile"));
const AdminOverview = lazyPage(() => import("./pages/admin/components/AdminOverview/AdminOverview"));
const UsersList = lazyPage(() => import("./pages/admin/components/UsersList/UsersList"));
const AdminList = lazyPage(() => import("./pages/admin/components/AdminList/AdminList"));
const FeedbacksList = lazyPage(() => import("./pages/admin/components/Feedback/FeedbacksList"));
const OnboardingRoot = lazyPage(() => import("./pages/onBoarding/OnboardingRoot"));
const EmailVerify = lazyPage(() => import("./pages/mailling/EmailVerify"));
const PostRegisterEmailVerify = lazyPage(() => import("./pages/mailling/PostRegisterEmailVerify"));
const ResetPassword = lazyPage(() => import("./pages/mailling/ResetPassword"));
const SendEmailResetPassword = lazyPage(() => import("./pages/mailling/SendEmailResetPassword"));
const Feedback = lazyPage(() => import("./pages/feedback/Feedback"));
const ProjectNavbar = lazyPage(() => import("./components/projectNavbar/ProjectNavbar"));
const DashboardProjects = lazyPage(() => import("./pages/projects/components/dashboard/Dashboard"));
const ParcelsTab = lazyPage(() => import("./pages/projects/components/parcels/ParcelsTab"));
const Members = lazyPage(() => import("./pages/projects/components/Members"));
const DocumentsTab = lazyPage(() => import("./pages/projects/components/documents/DocumentsTab"));
const ProjectsPanel = lazyPage(() => import("./pages/map/components/layers/Projects/ProjectsPanel"));
const ProjectsEmptyState = lazyPage(() => import("./pages/map/components/layers/Projects/ProjectsEmptyState"));
const ProjectWorkspace = lazyPage(() => import("./pages/map/components/layers/Projects/ProjectWorkspace"));

export default function App() {
  return (
    <>
      <CustomToaster />

      <Routes>
        <Route path="/verify" element={EmailVerify} />
        <Route path="/reset/password" element={ResetPassword} />
        {/* Routes Auth */}
        <Route path="/auth" element={AuthLayout}>
          <Route index element={AuthRoot} />
          <Route path="login" element={AuthLogin} />
          <Route path="register" element={AuthRegister} />
          <Route path="forgot-password" element={SendEmailResetPassword} />
          <Route path="register/verify" element={PostRegisterEmailVerify} />
        </Route>

        {/* Routes Protegé */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={OnboardingRoot} />

          {/* Layout Principal */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/search" replace />} />
            <Route path="dashboard" element={Dashboard} />
            <Route path="projects" element={Projects} />
            <Route path="profile" element={EditProfile} />
            <Route path="projects" element={ProjectNavbar}>
              <Route path=":projectId/dashboard" element={DashboardProjects} />
              <Route path=":projectId/plots" element={ParcelsTab} />
              <Route path=":projectId/members" element={Members} />
              <Route path=":projectId/documents" element={DocumentsTab} />
            </Route>
            <Route path="feedback" element={Feedback} />

            {/* Routes Admin */}
            <Route path="admin/*" element={<Navigate to="/search/admin" replace />} />
          </Route>

          {/* Route Carte (Plein écran, hors Layout standard j'imagine) */}
          <Route path="/search" element={<Map />}>
            <Route path="projects" element={ProjectsPanel}>
              <Route index element={ProjectsEmptyState} />
              <Route path=":projectId" element={ProjectWorkspace}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={DashboardProjects} />
                <Route path="plots" element={ParcelsTab} />
                <Route path="members" element={Members} />
                <Route path="documents" element={DocumentsTab} />
              </Route>
            </Route>
            <Route path="admin" element={<AdminRoute />}>
              <Route element={AdminPanel}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={AdminOverview} />
                <Route path="users" element={UsersList} />
                <Route path="users/:id" element={UserProfile} />
                <Route path="admins" element={AdminList} />
                <Route path="feedbacks" element={FeedbacksList} />
              </Route>
            </Route>
          </Route>

          {/* Layout Settings */}
          <Route path="/" element={<LayoutSettings />}>
            <Route path="profile" element={Profile} />
            <Route path="settings" element={<Navigate to="/settings/edit-profile" replace />} />
            <Route path="settings/notifications" element={Notifications} />
            <Route path="settings/billing" element={Billing} />
            <Route path="settings/privacy" element={Privacy} />
            <Route path="settings/security" element={Security} />
            <Route path="settings/subscriptions" element={Subscriptions} />
          </Route>

        </Route>

        {/* Fallback 404 - Redirige vers le dashboard (qui redirigera vers /auth si non connecté) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}