import { Link, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// Importamos la configuración de los menús
import {
  menuSuperAdmin,
  menuDirector,
  menuDocente,
  menuSistema,
} from "./menuConfig";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const nombreUsuario = user?.nombre || "Usuario";
  const rolUsuario = user?.rol?.replace("ROLE_", "") || "INVITADO";

  // Asignación dinámica súper limpia
  const getMenuItems = () => {
    switch (rolUsuario) {
      case "SUPERADMIN":
        return menuSuperAdmin;
      case "ADMIN_COLEGIO":
        return menuDirector;
      case "DOCENTE":
        return menuDocente;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-colors duration-300 fixed left-0 top-0 z-20">
      {/* Header del Sidebar */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
        <GraduationCap
          size={24}
          style={{ color: "var(--color-primary)" }}
          className="mr-2"
        />
        <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
          EduGestión
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">
          Menú Principal
        </p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
                style={
                  isActive
                    ? { borderLeft: "4px solid var(--color-primary)" }
                    : {}
                }
              >
                <span style={isActive ? { color: "var(--color-primary)" } : {}}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Menú de Sistema (Oculto para Docentes) */}
        {(rolUsuario === "SUPERADMIN" || rolUsuario === "ADMIN_COLEGIO") && (
          <>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-8 mb-4">
              Sistema
            </p>
            <div className="space-y-1">
              {menuSistema.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Perfil del Usuario */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-100">
              {nombreUsuario}
            </p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight truncate">
              {rolUsuario.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
