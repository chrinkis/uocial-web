import { Route, Routes } from "react-router";
import IndexPage from "@/pages/page";
import IndexLayout from "@/pages/layout";
import AboutPage from "@/pages/about/page";
import AppPage from "@/pages/app/page";
import LoginPage from "@/pages/auth/login/page";

function App() {
  return (
    <Routes>
      <Route element={<IndexLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="app" element={<AppPage />} />
        <Route path="auth/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
