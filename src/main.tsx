import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import axios from "axios";

const root = document.getElementById("root");
if (!root) {
  throw new Error();
}

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
