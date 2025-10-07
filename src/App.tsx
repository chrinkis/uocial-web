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

function getOpenRoutes() {
  return (
    <>
      <Route path="about" element={<AboutPage />} />
      <Route path="auth/login" element={<LoginPage />} />
      <Route path="auth/register" element={<RegisterPage />} />
    </>
  );
}

function getLoggedInRoutes() {
  return (
    <>
      <Route path="auth/verify-email" element={<VerifyEmailPage />} />
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
