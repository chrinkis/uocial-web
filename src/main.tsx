import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import axios from "axios";
import { useAsync } from "react-use";

const root = document.getElementById("root");
if (!root) {
  throw new Error();
}

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export function Main() {
  const { loading, error } = useAsync(
    async () => await axios.get("/sanctum/csrf-cookie"),
  );

  if (loading) {
    return; // FIXME
  }

  if (error) {
    return; // FIXME
  }

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(root).render(<Main />);
