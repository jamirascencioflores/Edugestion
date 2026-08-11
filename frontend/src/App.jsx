import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Mantenimiento from "./pages/public/Mantenimiento";
import Dashboard from "./pages/DashboardRouter";
import PlanesPagosSA from "./pages/SuperAdmin/PlanesPagos";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Docentes from "./pages/Director/GestionPersonal";
import CambiarPassword from "./pages/shared/CambiarPassword";
import GestionColegios from "./pages/SuperAdmin/GestionColegios";
import Periodos from "./pages/Director/GestionAcademica/Periodos/Periodos";
import GradosSecciones from "./pages/Director/GestionAcademica/GradosSecciones";
import GestionCursos from "./pages/Director/GestionAcademica/Cursos";
import MallaCurricular from "./pages/Director/GestionAcademica/MallaCurricular";
import Estudiantes from "./pages/Director/GestionAcademica/Estudiantes/index";
import Tarifarios from "./pages/Director/Finanzas/Tarifarios/index"; // <--- Nueva Importación
import CajaIndex from "./pages/Director/Finanzas/Caja/index"; // Importación para Caja
import RegistroCalificaciones from "./pages/Docentes/Calificaciones/RegistroCalificaciones";
import SetupPassword from "./pages/public/SetupPassword";
import RecuperarPassword from "./pages/public/RecuperarPassword";
import ResetPassword from "./pages/public/ResetPassword"; // Importación para ResetPassword
import AnunciosGlobales from "./pages/SuperAdmin/AnunciosGlobales"; // Importación para AnunciosGlobales
import Seguridad from "./pages/SuperAdmin/Seguridad"; // Importación para Seguridad
import SeguridadPage from "./pages/Director/Seguridad"; // Importación para Seguridad del Director
import Configuracion from "./pages/SuperAdmin/Configuracion"; // Importación para Configuración
import ConfiguracionPage from "./pages/public/ConfiguracionPage";
import ReporteMorosos from "./pages/Director/ReporteMorosos"; // Importación para Reporte de Morosos

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("default");

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
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />

          {/* DASHBOARD PRINCIPAL */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* SUPERADMIN */}
          <Route
            path="/colegios"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <GestionColegios />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/planes"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <PlanesPagosSA />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/anuncios-globales"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <AnunciosGlobales />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/seguridad"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Seguridad />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuracion"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Configuracion />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* RUTAS DIRECTOR Y DOCENTE */}
          <Route
            path="/seguridadpage"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO", "DOCENTE"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <SeguridadPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuracionpage"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <ConfiguracionPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/docentes"
            element={
              <ProtectedRoute allowedRoles={["SUPERADMIN", "ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Docentes />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* ACADÉMICO */}
          <Route
            path="/periodos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Periodos />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/grados-secciones"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <GradosSecciones />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cursos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <GestionCursos />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/malla-curricular"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <MallaCurricular />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/estudiantes"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Estudiantes />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* FINANZAS */}
          <Route
            path="/tarifarios"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <Tarifarios />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/caja"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <CajaIndex />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reporte-morosos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN_COLEGIO"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <ReporteMorosos />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* DOCENTE */}
          <Route
            path="/calificaciones"
            element={
              <ProtectedRoute allowedRoles={["DOCENTE"]}>
                <AdminLayout
                  theme={theme}
                  setTheme={setTheme}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                >
                  <RegistroCalificaciones />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* GESTIÓN DE PASSWORDS */}
          <Route
            path="/cambiar-password"
            element={
              <ProtectedRoute>
                <CambiarPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/setup-password" element={<SetupPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
