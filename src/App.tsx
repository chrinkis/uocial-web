import { Route, Routes } from "react-router";
import IndexPage from "@/pages/page";
import IndexLayout from "@/pages/layout";
import AboutPage from "@/pages/about/page";
import AppPage from "@/pages/app/page";
import LoginPage from "@/pages/auth/login/page";
import RegisterPage from "@/pages/auth/register/page";
import VerifyEmailPage from "@/pages/auth/verify-email/page";
import { LoggedInGuard } from "./guards/LoggedInGuard";
import { VerifiedGuard } from "./guards/VerifiedGuard";
import ResetPasswordPage from "@/pages/auth/password/reset/page";
import ForgotPasswordPage from "@/pages/auth/password/forgot/page";
import VerifyEmailActionPage from "@/pages/auth/email/verify/page";
import PostsPage from "@/pages/app/posts/page";
import SettingsPage from "@/pages/settings/page";
import SavedPostsPage from "@/pages/app/posts/saved/page";
import { ModeratorGuard } from "./guards/ModeratorGuard";

function getOpenRoutes() {
  return (
    <>
      <Route path="about" element={<AboutPage />} />
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="auth/register" element={<RegisterPage />} />
      <Route
        path="auth/password/reset/:token"
        element={<ResetPasswordPage />}
      />
      <Route path="auth/password/forgot" element={<ForgotPasswordPage />} />
    </>
  );
}

function getLoggedInRoutes() {
  return (
    <>
      <Route path="auth/verify-email" element={<VerifyEmailPage />} />
      <Route path="auth/email/verify" element={<VerifyEmailActionPage />} />
    </>
  );
}

function getVerifiedRoutes() {
  return (
    <>
      <Route path="settings" element={<SettingsPage />} />
      <Route path="app" element={<AppPage />} />
      <Route path="app/posts" element={<PostsPage />} />
      <Route path="app/posts/saved" element={<SavedPostsPage />} />
    </>
  );
}

function getModeratorRoutes() {
  return <></>;
}

function App() {
  return (
    <Routes>
      <Route element={<IndexLayout />}>
        <Route index element={<IndexPage />} />

        {getOpenRoutes()}

        <Route element={<LoggedInGuard />}>
          {getLoggedInRoutes()}

          <Route element={<VerifiedGuard />}>
            {getVerifiedRoutes()}

            <Route element={<ModeratorGuard />}>{getModeratorRoutes()}</Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
