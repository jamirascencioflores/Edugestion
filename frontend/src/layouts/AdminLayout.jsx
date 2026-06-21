import { LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const nombreUsuario = user?.nombre || "Usuario";
  const rolUsuario = user?.rol?.replace("ROLE_", "") || "Administrador";

  const getSearchPlaceholder = (rol) => {
    switch (rol) {
      case "SUPERADMIN":
        return "Buscar colegios, usuarios...";
      case "ADMIN_COLEGIO": // <-- Corregido para que coincida con tu backend
        return "Buscar docentes o alumnos...";
      case "DOCENTE":
        return "Buscar mis clases o materiales...";
      default:
        return "Buscar...";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 sticky top-0 z-10">
          {/* LADO IZQUIERDO: Buscador Dinámico */}
          <div className="relative w-96 hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder={getSearchPlaceholder(rolUsuario)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-10 text-sm focus:outline-none transition-colors"
              style={{ paddingLeft: "2.5rem" }} // Asegurando espacio para el ícono
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) => (e.target.style.borderColor = "")}
            />
          </div>

          {/* LADO DERECHO: Colegio, Perfil y Logout */}
          <div className="flex items-center gap-6">
            {/* BADGE DEL COLEGIO */}
            {user && rolUsuario !== "SUPERADMIN" && (
              <div className="hidden md:flex items-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                🏫 {user?.nombreColegio || "Mi Colegio"}
              </div>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                    {nombreUsuario}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">
                    {rolUsuario.replace("_", " ")}
                  </p>
                </div>
                {/* Avatar circular dinámico */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: "var(--color-primary, #3b82f6)" }}
                >
                  {nombreUsuario.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-auto text-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
