
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
