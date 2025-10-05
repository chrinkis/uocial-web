import { Route, Routes } from "react-router";
import IndexLayout from "@/pages/layout";
import LoginPage from "@/pages/auth/login/page";

function App() {
  return (
    <Routes>
      <Route element={<IndexLayout />}>
        <Route path="auth/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
