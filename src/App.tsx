import { Route, Routes } from "react-router";
import LoginPage from "@/pages/auth/login/page";

function App() {
  return (
    <Routes>
      <Route path="auth/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
