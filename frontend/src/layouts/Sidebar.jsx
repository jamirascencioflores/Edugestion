import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  menuSuperAdmin,
  menuSuperAdminSistema,
  menuDirector,
  menuDocente,
  menuSistema,
} from "./menuConfig";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const nombreUsuario = user?.nombre || "Usuario";
  const rolUsuario = user?.rol?.replace("ROLE_", "") || "ADMIN_COLEGIO";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  const getSystemMenuItems = () => {
    switch (rolUsuario) {
      case "SUPERADMIN":
        return menuSuperAdminSistema;
      case "ADMIN_COLEGIO":
        return menuSistema;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const systemMenuItems = getSystemMenuItems();

  return (
    <>
      {/* Overlay oscuro para cerrar el menú en móvil al hacer clic afuera */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* BRANDING + BOTÓN CERRAR MÓVIL */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <GraduationCap
              size={24}
              style={{ color: "var(--color-primary)" }}
              className="mr-2"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-slate-800 dark:text-slate-100">
                EduGestión
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Administración v2.0
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENÚ DE NAVEGACIÓN */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">
            Menú Principal
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose} // Cierra el menú al hacer clic en móvil
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                  style={
                    isActive
                      ? { borderLeft: "4px solid var(--color-primary)" }
                      : {}
                  }
                >
                  <span
                    style={isActive ? { color: "var(--color-primary)" } : {}}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {systemMenuItems.length > 0 && (
            <>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-6 mb-3">
                {rolUsuario === "SUPERADMIN"
                  ? "Administración SaaS"
                  : "Sistema"}
              </p>
              <div className="space-y-1">
                {systemMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span
                        style={
                          isActive ? { color: "var(--color-primary)" } : {}
                        }
                      >
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* PERFIL Y CERRAR SESIÓN */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div
              className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-xs"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">
                {nombreUsuario}
              </p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight truncate">
                {rolUsuario.replace("_", " ")}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-100 dark:border-red-900/40"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
