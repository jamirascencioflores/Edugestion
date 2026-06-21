import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // <--- Importamos el proveedor

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Envolvemos la App con el AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
