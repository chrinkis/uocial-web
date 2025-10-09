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
      <Route path="app" element={<AppPage />} />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<IndexLayout />}>
        <Route index element={<IndexPage />} />

        {getOpenRoutes()}

        <Route element={<LoggedInGuard />}>
          {getLoggedInRoutes()}

          <Route element={<VerifiedGuard />}>{getVerifiedRoutes()}</Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
