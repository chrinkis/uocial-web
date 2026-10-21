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
import HashtagsPage from "@/pages/app/posts/hashtags/page";
import SearchPostsPage from "@/pages/app/posts/search/page";
import ReviewsPage from "@/pages/app/reviews/page";
import DepartmentsPage from "@/pages/app/reviews/departments/page";
import DepartmentPage from "@/pages/app/reviews/departments/detail/page";
import CoursePage from "@/pages/app/reviews/departments/courses/detail/page";
import CourseInstructorsPage from "@/pages/app/reviews/departments/courses/instructors/page";
import CourseOfferingPage from "@/pages/app/reviews/departments/courses/offerings/detail/page";
import InstructorsPage from "@/pages/app/reviews/departments/instructors/page";
import ModerationDashboardPage from "@/pages/app/moderation/dashboard/page";
import { AdminGuard } from "./guards/AdminGuard";
import { BannedGuard } from "./guards/BannedGuard";
import BannedPage from "@/pages/app/banned/page";
import AdministrationDashboardPage from "@/pages/app/administration/dashboard/page";
import { LegalGuard } from "./guards/LegalGuard";
import TermsOfUsePage from "@/pages/legal/terms-of-use/page";
import PrivacyPolicyPage from "@/pages/legal/privacy-policy/page";

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

      <Route path="legal/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="legal/terms-of-use" element={<TermsOfUsePage />} />
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

function getBannedRoutes() {
  return (
    <>
      <Route path="app/banned" element={<BannedPage />} />
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
      <Route path="app/posts/search" element={<SearchPostsPage />} />
      <Route path="app/posts/hashtags" element={<HashtagsPage />} />
      <Route path="app/reviews" element={<ReviewsPage />} />
      <Route path="app/reviews/departments" element={<DepartmentsPage />} />
      <Route
        path="app/reviews/departments/:departmentId"
        element={<DepartmentPage />}
      />
      <Route
        path="app/reviews/departments/:departmentId/courses/:courseId"
        element={<CoursePage />}
      />
      <Route
        path="app/reviews/departments/:departmentId/courses/:courseId/instructors"
        element={<CourseInstructorsPage />}
      />
      <Route
        path="app/reviews/departments/:departmentId/courses/:courseId/offerings/:offeringId"
        element={<CourseOfferingPage />}
      />
      <Route
        path="app/reviews/departments/:departmentId/instructors"
        element={<InstructorsPage />}
      />
    </>
  );
}

function getModeratorRoutes() {
  return (
    <>
      <Route
        path="app/moderation/dashboard"
        element={<ModerationDashboardPage />}
      />
    </>
  );
}

function getAdminRoutes() {
  return (
    <>
      <Route
        path="app/administration/dashboard"
        element={<AdministrationDashboardPage />}
      />
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
          {getBannedRoutes()}

          <Route element={<BannedGuard />}>
            <Route element={<LegalGuard />}>
              {getLoggedInRoutes()}

              <Route element={<VerifiedGuard />}>
                {getVerifiedRoutes()}

                <Route element={<ModeratorGuard />}>
                  {getModeratorRoutes()}
                </Route>

                <Route element={<AdminGuard />}>{getAdminRoutes()}</Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
