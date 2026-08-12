// src/pages/Director/GestionAcademica/Periodos/TablaPeriodos.jsx
import { Edit, Trash2, CheckCircle2, Clock, Lock } from "lucide-react";

export default function TablaPeriodos({
  periodos,
  loading,
  anioFiltro,
  onEdit,
  onDelete,
  onCambiarEstado,
}) {
  const renderBadgeEstado = (p) => {
    switch (p.estado) {
      case "ACTIVO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={13} /> Activo
          </span>
        );
      case "PENDIENTE":
        return (
          <button
            onClick={() => onCambiarEstado(p.id, "ACTIVO")}
            title="Haz clic para activar este periodo"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
          >
            <Clock size={13} /> Pendiente (Activar)
          </button>
        );
      case "CERRADO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <Lock size={13} /> Cerrado
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
        Cargando periodos académicos...
      </div>
    );
  }

  if (periodos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay periodos registrados para el año {anioFiltro}. ¡Prueba
        autogenerar la estructura!
      </div>
    );
  }

  return (
    <>
      {/* VISTA MÓVIL (Cards) - Se activa en pantallas < lg */}
      <div className="lg:hidden space-y-3">
        {periodos.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                {p.nombre}
              </h3>
              {renderBadgeEstado(p)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60 font-mono">
              <div>
                <span className="text-slate-400 font-sans block">Inicio:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">
                  {p.fechaInicio}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block">Fin:</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold">
                  {p.fechaFin}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => onEdit(p)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-lg transition-colors"
              >
                <Edit size={14} /> Editar
              </button>

              <button
                onClick={() => onDelete(p.id)}
                disabled={p.estado === "CERRADO"}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  p.estado === "CERRADO"
                    ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                    : "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400"
                }`}
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VISTA DESKTOP (Tabla tradicional) - Se activa en pantallas >= lg */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-4 px-6">Nombre del Periodo</th>
                <th className="py-4 px-6">Inicio</th>
                <th className="py-4 px-6">Fin</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              {periodos.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                    {p.nombre}
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono">
                    {p.fechaInicio}
                  </td>
                  <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-mono">
                    {p.fechaFin}
                  </td>
                  <td className="py-4 px-6">{renderBadgeEstado(p)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                        title="Editar Periodo"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        disabled={p.estado === "CERRADO"}
                        className={`p-1.5 transition-colors rounded-lg ${
                          p.estado === "CERRADO"
                            ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                            : "text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                        }`}
                        title="Eliminar Periodo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
