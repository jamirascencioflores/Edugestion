import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sun, Moon, Palette } from "lucide-react";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Mantenimiento from "./pages/public/Mantenimiento";
import Dashboard from "./pages/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Docentes from "./pages/Director/GestionPersonal";
import CambiarPassword from "./pages/shared/CambiarPassword";
import GestionColegios from "./pages/SuperAdmin/GestionColegios";
import Periodos from "./pages/Director/GestionAcademica/Periodos/Periodos";
import GradosSecciones from "./pages/Director/GestionAcademica/GradosSecciones";
import GestionCursos from "./pages/Director/GestionAcademica/Cursos";
import MallaCurricular from "./pages/Director/GestionAcademica/MallaCurricular";
import Estudiantes from "./pages/Director/GestionAcademica/Estudiantes/Index";
import Tarifarios from "./pages/Director/Finanzas/Tarifarios/index"; // <--- Nueva Importación
import CajaIndex from "./pages/Director/Finanzas/Caja/index"; // Importación para Caja
import RegistroCalificaciones from "./pages/Docentes/Calificaciones/RegistroCalificaciones";
import SetupPassword from "./pages/public/SetupPassword";
import RecuperarPassword from "./pages/public/RecuperarPassword";
import ResetPassword from "./pages/public/ResetPassword"; // Importación para ResetPassword

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("default");
  const [showPalette, setShowPalette] = useState(false); // <--- Nuevo estado

  // Lista de temas
  const themes = [
    { id: "default", name: "Morado", color: "#5b21b6" },
    { id: "emerald", name: "Esmeralda", color: "#059669" },
    { id: "blue", name: "Azul", color: "#2563eb" },
    { id: "rosa", name: "Rosa", color: "#f472b6" },
    { id: "rojo", name: "Rojo", color: "#e11d48" },
  ];

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Controles flotantes */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Menú desplegable de colores */}
          {showPalette && (
            <div className="flex items-center gap-2 p-2 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-right-4 duration-200">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setShowPalette(false);
                  }}
                  title={t.name}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-125 ${
                    theme === t.id
                      ? "ring-2 ring-offset-2 ring-purple-500 scale-110"
                      : ""
                  }`}
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          )}

          {/* Botón Abrir Paleta */}
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:scale-110 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Palette size={20} style={{ color: "var(--color-primary)" }} />
          </button>

          {/* Botón Modo Oscuro/Claro */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:scale-110 transition-all border border-slate-200 dark:border-slate-700"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-slate-700 dark:text-slate-200" />
            )}
          </button>
        </div>

        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* COLEGIOS: SUPERADMIN */}
          <Route
            path="/colegios"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AdminLayout>
                  <GestionColegios />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* DOCENTES */}
          <Route
            path="/docentes"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN", "ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <Docentes />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* CAMBIAR PASSWORD */}
          <Route
            path="/cambiar-password"
            element={
              <ProtectedRoute>
                <CambiarPassword />
              </ProtectedRoute>
            }
          />

          {/* RECUPERAR PASSWORD */}
          <Route
            path="/recuperar-password"
            element={<RecuperarPassword />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ACADÉMICO: PERIODOS */}
          <Route
            path="/periodos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <Periodos />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ACADÉMICO: GRADOS Y SECCIONES */}
          <Route
            path="/grados-secciones"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <GradosSecciones />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ACADÉMICO: CURSOS */}
          <Route
            path="/cursos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <GestionCursos />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ACADÉMICO: MALLA CURRICULAR */}
          <Route
            path="/malla-curricular"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <MallaCurricular />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ACADÉMICO: ESTUDIANTES */}
          <Route
            path="/estudiantes"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <Estudiantes />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* FINANZAS: TARIFARIOS */}
          <Route
            path="/tarifarios"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <Tarifarios />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/caja"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout>
                  <CajaIndex />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* CALIFICACIONES (Portal Docente) */}
          <Route
            path="/calificaciones"
            element={
              <ProtectedRoute allowedRoles={["DOCENTE"]}>
                <AdminLayout>
                  <RegistroCalificaciones />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/setup-password" element={<SetupPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
