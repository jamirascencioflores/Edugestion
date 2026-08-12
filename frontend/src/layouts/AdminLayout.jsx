import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Palette,
  X,
  ArrowRight,
  Menu,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  menuSuperAdmin,
  menuSuperAdminSistema,
  menuDirector,
  menuDocente,
  menuSistema,
} from "./menuConfig";

export default function AdminLayout({
  children,
  theme,
  setTheme,
  darkMode,
  setDarkMode,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPalette, setShowPalette] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 👈 Estado para menú móvil
  const [searchQuery, setSearchQuery] = useState("");

  const rolUsuario = user?.rol?.replace("ROLE_", "") || "ADMIN_COLEGIO";

  const isMac =
    typeof window !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.userAgent || navigator.platform);
  const kbdText = isMac ? "⌘K" : "Ctrl+K";

  const themes = [
    { id: "default", name: "Morado", color: "#5b21b6" },
    { id: "emerald", name: "Esmeralda", color: "#059669" },
    { id: "blue", name: "Azul", color: "#2563eb" },
    { id: "rosa", name: "Rosa", color: "#f472b6" },
    { id: "rojo", name: "Rojo", color: "#e11d48" },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getAllRoutesForUser = () => {
    switch (rolUsuario) {
      case "SUPERADMIN":
        return [...menuSuperAdmin, ...menuSuperAdminSistema];
      case "ADMIN_COLEGIO":
        return [...menuDirector, ...menuSistema];
      case "DOCENTE":
        return menuDocente;
      default:
        return [];
    }
  };

  const allRoutes = getAllRoutesForUser();

  const filteredRoutes = allRoutes.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNavigate = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
      {/* Sidebar con Drawer Móvil */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenedor principal: ml-0 en móvil, ml-64 en desktop */}
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          {/* Botón Hamburguesa (Móvil) + Buscador (Desktop) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              title="Abrir menú"
            >
              <Menu size={22} />
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="relative w-full sm:w-80 lg:w-96 flex items-center text-left bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs lg:text-sm text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <Search size={16} className="mr-2 text-slate-400 shrink-0" />
              <span className="truncate">Buscar accesos rápidos...</span>
              <kbd className="absolute right-3 hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                {kbdText}
              </kbd>
            </button>
          </div>

          {/* CONTROLES DERECHA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && rolUsuario !== "SUPERADMIN" && (
              <div className="hidden lg:flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-100 dark:border-indigo-800">
                🏫 {user?.nombreColegio || "Colegio San Pedro"}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Personalizar color de tema"
              >
                <Palette size={18} style={{ color: "var(--color-primary)" }} />
              </button>

              {showPalette && (
                <div className="absolute right-0 mt-2 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowPalette(false);
                      }}
                      title={t.name}
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${
                        theme === t.id
                          ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                          : ""
                      }`}
                      style={{ backgroundColor: t.color }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Notificaciones"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Cambiar tema"
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-500" />
              ) : (
                <Moon size={18} />
              )}
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 overflow-auto text-slate-900 dark:text-slate-100">
          {children}
        </main>
      </div>

      {/* MODAL PALETA DE COMANDOS */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-16 lg:pt-20 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
              <Search size={20} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Escribe un módulo o acción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full py-4 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">
                Navegación Rápida
              </p>
              {filteredRoutes.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-400">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              ) : (
                filteredRoutes.map((route) => (
                  <button
                    key={route.name}
                    onClick={() => handleNavigate(route.path)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 text-sm transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {route.icon}
                      </span>
                      <span>{route.name}</span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-slate-400 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
