import { ShieldAlert, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

export default function MantenimientoCard({
  mantenimientoActivo,
  onToggleMantenimiento,
  loading,
}) {
  const handleConfirmToggle = async () => {
    const nuevoEstado = !mantenimientoActivo;

    const result = await Swal.fire({
      title: nuevoEstado
        ? "¿Activar Mantenimiento Global?"
        : "¿Desactivar Mantenimiento?",
      text: nuevoEstado
        ? "Ningún colegio podrá acceder al sistema. Todos verán la pantalla de mantenimiento."
        : "El sistema volverá a la normalidad para todos los colegios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado ? "#ef4444" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: nuevoEstado
        ? "Sí, bloquear sistema"
        : "Sí, reactivar sistema",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#fff"
        : "#1e293b",
    });

    if (result.isConfirmed) {
      onToggleMantenimiento(nuevoEstado);
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border shadow-sm transition-all ${
        mantenimientoActivo
          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              mantenimientoActivo
                ? "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-300"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            }`}
          >
            {mantenimientoActivo ? (
              <ShieldAlert size={28} />
            ) : (
              <ShieldCheck size={28} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Estado de Mantenimiento Global
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Al activar este modo, todas las peticiones de los colegios
              (directores, docentes, alumnos) serán bloqueadas. Solo la cuenta{" "}
              <strong>SUPERADMIN</strong> mantendrá acceso al panel.
            </p>
          </div>
        </div>

        <button
          onClick={handleConfirmToggle}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all shrink-0 ${
            mantenimientoActivo
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {mantenimientoActivo ? (
            <ShieldCheck size={18} />
          ) : (
            <ShieldAlert size={18} />
          )}
          <span>
            {mantenimientoActivo ? "Sistema Pausado" : "Pausar Sistema"}
          </span>
        </button>
      </div>
    </div>
  );
}
