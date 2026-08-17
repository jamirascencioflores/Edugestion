// src/pages/Director/Finanzas/Tarifarios/TablaTarifario.jsx
import { Edit2, Power, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";
import { toast } from "sonner";

export default function TablaTarifario({
  tarifarios,
  grados,
  loading,
  onEdit,
  onToggleStatus,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        ></div>
      </div>
    );
  }

  const tarifariosAgrupados = grados
    .map((g) => {
      const tarifasDelGrado = tarifarios.filter(
        (t) => String(t.gradoId) === String(g.id),
      );

      const matricula = tarifasDelGrado.find(
        (t) => t.tipoTarifa === "MATRICULA",
      );
      const pension = tarifasDelGrado.find((t) => t.tipoTarifa === "PENSION");

      if (!matricula && !pension) return null;

      const estaActivo =
        (matricula?.estado ?? true) && (pension?.estado ?? true);

      return {
        gradoId: g.id,
        nombreGrado: g.nombre,
        matricula,
        pension,
        estado: estaActivo,
      };
    })
    .filter(Boolean);

  const handleEliminar = async (item) => {
    const result = await Swal.fire({
      title: "¿Eliminar tarifas del grado?",
      html: `Estás a punto de eliminar las tarifas de <b>${item.nombreGrado}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ Esta acción no se puede deshacer.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const promises = [];
        if (item.matricula)
          promises.push(
            api.delete(`/finanzas/tarifarios/${item.matricula.id}`),
          );
        if (item.pension)
          promises.push(api.delete(`/finanzas/tarifarios/${item.pension.id}`));

        await Promise.all(promises);
        toast.success("Tarifas eliminadas correctamente");
        onRefresh();
      } catch {
        toast.error("Error al eliminar las tarifas");
      }
    }
  };

  if (tarifariosAgrupados.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay tarifas configuradas para este año o criterio.
      </div>
    );
  }

  return (
    <>
      {/* VISTA MÓVIL (Cards) - Se activa en pantallas < lg */}
      <div className="lg:hidden space-y-3">
        {tarifariosAgrupados.map((item) => (
          <div
            key={item.gradoId}
            className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 transition-opacity ${
              !item.estado
                ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                : ""
            }`}
          >
            {/* Cabecera del Card */}
            <div className="flex items-center justify-between gap-2">
              <h3
                className={`font-bold text-sm truncate ${
                  item.estado
                    ? "text-slate-800 dark:text-slate-100"
                    : "text-slate-500 dark:text-slate-400 line-through"
                }`}
              >
                {item.nombreGrado}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  item.estado
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.estado ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {item.estado ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* Montos de Matrícula y Pensión */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <div className="bg-sky-50/60 dark:bg-sky-950/30 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/40 text-center">
                <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 block mb-0.5">
                  Matrícula
                </span>
                {item.matricula ? (
                  <span className="text-sm font-bold text-sky-900 dark:text-sky-200 font-mono">
                    S/ {Number(item.matricula.montoMensual).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No fijada
                  </span>
                )}
              </div>

              <div className="bg-purple-50/60 dark:bg-purple-950/30 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40 text-center">
                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 block mb-0.5">
                  Pensión Mensual
                </span>
                {item.pension ? (
                  <span className="text-sm font-bold text-purple-900 dark:text-purple-200 font-mono">
                    S/ {Number(item.pension.montoMensual).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No fijada
                  </span>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => onEdit(item)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg transition-colors"
              >
                <Edit2 size={14} /> Editar
              </button>

              <button
                onClick={() => {
                  const objetivo = item.pension || item.matricula;
                  if (objetivo) onToggleStatus(objetivo.id, objetivo.estado);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  item.estado
                    ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
                    : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                }`}
              >
                <Power size={14} /> {item.estado ? "Inactivar" : "Activar"}
              </button>

              {!item.estado && (
                <button
                  onClick={() => handleEliminar(item)}
                  className="p-1.5 text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-lg transition-colors"
                  title="Eliminar Definitivamente"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VISTA DESKTOP (Tabla tradicional) - Se activa en pantallas >= lg */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
              <tr>
                <th className="px-6 py-4">Grado Escolar</th>
                <th className="px-6 py-4 text-center">Matrícula</th>
                <th className="px-6 py-4 text-center">Pensión Mensual</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {tarifariosAgrupados.map((item) => (
                <tr
                  key={item.gradoId}
                  className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60 ${
                    !item.estado
                      ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                    {item.nombreGrado}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {item.matricula ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 rounded-lg text-sm font-bold font-mono">
                        S/ {Number(item.matricula.montoMensual).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No fijada
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {item.pension ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 rounded-lg text-sm font-bold font-mono">
                        S/ {Number(item.pension.montoMensual).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No fijada
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.estado
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.estado ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {item.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                        title="Editar Tarifas del Grado"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => {
                          const objetivo = item.pension || item.matricula;
                          if (objetivo)
                            onToggleStatus(objetivo.id, objetivo.estado);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.estado
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        }`}
                        title={item.estado ? "Inactivar" : "Activar"}
                      >
                        <Power size={16} />
                      </button>

                      {!item.estado && (
                        <button
                          onClick={() => handleEliminar(item)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Eliminar Definitivamente"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
