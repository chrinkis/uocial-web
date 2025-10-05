import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import axios from "axios";
import { AppProviders } from "./providers/index.tsx";

import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error();
}

async function init() {
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  await axios.get("/sanctum/csrf-cookie");
}

export function Main() {
  useEffect(() => {
    void init();
  }, []);

  return (
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>
  );
}

createRoot(root).render(<Main />);
