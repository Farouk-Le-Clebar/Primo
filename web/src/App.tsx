import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTS
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AdminRoute from "./components/adminRoute/AdminRoute";
import LegacyMapRedirect from "./components/legacyRedirect/LegacyMapRedirect";
import { LEGACY_MAP_PREFIX, ROUTES } from "./constants/routes";
import CustomToaster from "./components/toaster/CustomToaster";

import { lazyPage, lazyPanel } from "./components/lazyPage/lazyPage";
import Map from "./pages/map/Map";

const AuthLayout = lazyPage(() => import("./pages/auth/AuthLayout"));
const AuthRoot = lazyPage(() => import("./pages/auth/AuthRoot"));
const AuthLogin = lazyPage(() => import("./pages/auth/AuthLogin"));
const AuthRegister = lazyPage(() => import("./pages/auth/AuthRegister"));
const ProfilePanel = lazyPanel(() => import("./pages/settings/editProfile/ProfilePanel"));
const AdminPanel = lazyPanel(() => import("./pages/admin/AdminPanel"));
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
const FeedbackPanel = lazyPanel(() => import("./pages/feedback/FeedbackPanel"));
const DashboardProjects = lazyPage(() => import("./pages/projects/components/dashboard/Dashboard"));
const ParcelsTab = lazyPage(() => import("./pages/projects/components/parcels/ParcelsTab"));
const Members = lazyPage(() => import("./pages/projects/components/Members"));
const DocumentsTab = lazyPage(() => import("./pages/projects/components/documents/DocumentsTab"));
const DashboardPanel = lazyPanel(() => import("./pages/map/components/layers/Dashboard/DashboardPanel"));
const ProjectsPanel = lazyPanel(() => import("./pages/map/components/layers/Projects/ProjectsPanel"));
const ProjectsEmptyState = lazyPage(() => import("./pages/map/components/layers/Projects/ProjectsEmptyState"));
const ProjectWorkspace = lazyPage(() => import("./pages/map/components/layers/Projects/ProjectWorkspace"));

export default function App() {
  return (
    <>
      <CustomToaster />

      <Routes>
        <Route path="/verify" element={EmailVerify} />
        <Route path="/reset/password" element={ResetPassword} />
        <Route path="/auth" element={AuthLayout}>
          <Route index element={AuthRoot} />
          <Route path="login" element={AuthLogin} />
          <Route path="register" element={AuthRegister} />
          <Route path="forgot-password" element={SendEmailResetPassword} />
          <Route path="register/verify" element={PostRegisterEmailVerify} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.onboarding} element={OnboardingRoot} />

          <Route path={ROUTES.map} element={<Map />}>
            <Route path="dashboard" element={DashboardPanel} />
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
            <Route path="feedback" element={FeedbackPanel} />
            <Route path="profile" element={ProfilePanel} />
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

          <Route path={`${LEGACY_MAP_PREFIX}/*`} element={<LegacyMapRedirect />} />
          <Route path="/settings/*" element={<Navigate to={ROUTES.profile} replace />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.map} replace />} />
      </Routes>
    </>
  );
}