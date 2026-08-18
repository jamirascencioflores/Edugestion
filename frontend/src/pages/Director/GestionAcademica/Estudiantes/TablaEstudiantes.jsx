import { Edit, Trash2, Power, User } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

export default function TablaEstudiantes({
  estudiantes,
  secciones = [],
  grados = [],
  onRefresh,
  onEdit,
}) {
  const handleCambiarEstado = async (estudiante) => {
    const accion = estudiante.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} este Estudiante?`,
      html: `El estudiante <b>${estudiante.nombres} ${estudiante.apellidos}</b> pasará a estado ${
        estudiante.estado ? "inactivo" : "activo"
      }.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estudiante.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/academicos/estudiantes/${estudiante.id}`, {
          ...estudiante,
          estado: !estudiante.estado,
        });
        toast.success(
          `Estudiante ${
            estudiante.estado ? "desactivado" : "activado"
          } correctamente`,
        );
        onRefresh();
      } catch {
        toast.error("Error al cambiar el estado del estudiante");
      }
    }
  };

  const handleEliminar = async (estudiante) => {
    const result = await Swal.fire({
      title: "¿Eliminar este Estudiante?",
      html: `Estás a punto de eliminar a <b>${estudiante.nombres} ${estudiante.apellidos}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Esta acción es irreversible.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/estudiantes/${estudiante.id}`);
        toast.success("Estudiante eliminado correctamente");
        onRefresh();
      } catch {
        toast.error(
          "Error al eliminar al estudiante. Verifica si tiene registros dependientes.",
        );
      }
    }
  };

  if (!estudiantes || estudiantes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 min-h-[300px] flex items-center justify-center">
        No hay estudiantes registrados con los criterios seleccionados.
      </div>
    );
  }

  return (
    <>
      {/* VISTA MÓVIL (Cards) con min-h para estabilidad */}
      <div className="lg:hidden space-y-3 min-h-[560px]">
        {estudiantes.map((e) => {
          const iniciales = `${e.nombres?.[0] || ""}${
            e.apellidos?.[0] || ""
          }`.toUpperCase();

          const idSeccionTarget = Number(e.seccionId || e.seccion?.id);
          const seccionAsignada = secciones.find(
            (s) => Number(s.id) === idSeccionTarget,
          );

          const idGradoOrigen = Number(
            seccionAsignada?.gradoId || seccionAsignada?.grado?.id,
          );

          const gradoAsignado = grados.find(
            (g) => Number(g.id) === idGradoOrigen,
          );

          const etiquetaUbicacion =
            gradoAsignado && seccionAsignada
              ? `${gradoAsignado.nombre} - "${seccionAsignada.nombre}"`
              : seccionAsignada
                ? `Sección ${seccionAsignada.nombre}`
                : "Sin Asignar";

          return (
            <div
              key={e.id}
              className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 transition-opacity ${
                !e.estado
                  ? "opacity-75 bg-slate-50/50 dark:bg-slate-900/40"
                  : ""
              }`}
            >
              {/* Header de la Tarjeta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${
                      e.estado
                        ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {iniciales}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-bold text-sm truncate ${
                        e.estado
                          ? "text-slate-800 dark:text-slate-100"
                          : "text-slate-500 dark:text-slate-400 line-through"
                      }`}
                    >
                      {e.nombres} {e.apellidos}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      DNI:{" "}
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {e.dni}
                      </span>
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    e.estado
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      e.estado ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {e.estado ? "Matriculado" : "Retirado"}
                </span>
              </div>

              {/* Ubicación y Apoderado */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Grado / Sección:</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      etiquetaUbicacion === "Sin Asignar"
                        ? "bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400"
                        : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60"
                    }`}
                  >
                    {etiquetaUbicacion}
                  </span>
                </div>

                {e.nombreApoderado &&
                  String(e.nombreApoderado).trim() !== "" && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <User size={12} /> Apoderado:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                        {e.nombreApoderado}
                      </span>
                    </div>
                  )}
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => onEdit(e)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg transition-colors"
                >
                  <Edit size={14} /> Editar
                </button>

                <button
                  onClick={() => handleCambiarEstado(e)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    e.estado
                      ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
                      : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                  }`}
                >
                  <Power size={14} /> {e.estado ? "Retirar" : "Matricular"}
                </button>

                {!e.estado && (
                  <button
                    onClick={() => handleEliminar(e)}
                    className="p-1.5 text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* VISTA DESKTOP con min-h fija */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[560px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
              <tr>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Grado y Sección</th>
                <th className="px-6 py-4">F. Nacimiento</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {estudiantes.map((e) => {
                const iniciales = `${e.nombres?.[0] || ""}${
                  e.apellidos?.[0] || ""
                }`.toUpperCase();

                const idSeccionTarget = Number(e.seccionId || e.seccion?.id);
                const seccionAsignada = secciones.find(
                  (s) => Number(s.id) === idSeccionTarget,
                );

                const idGradoOrigen = Number(
                  seccionAsignada?.gradoId || seccionAsignada?.grado?.id,
                );

                const gradoAsignado = grados.find(
                  (g) => Number(g.id) === idGradoOrigen,
                );

                const etiquetaUbicacion =
                  gradoAsignado && seccionAsignada
                    ? `${gradoAsignado.nombre} - "${seccionAsignada.nombre}"`
                    : seccionAsignada
                      ? `Sección ${seccionAsignada.nombre}`
                      : "Sin Asignar";

                return (
                  <tr
                    key={e.id}
                    className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60 ${
                      !e.estado
                        ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                            e.estado
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {iniciales}
                        </div>
                        <div>
                          <p
                            className={`font-bold ${
                              e.estado
                                ? "text-slate-800 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400 line-through"
                            }`}
                          >
                            {e.nombres} {e.apellidos}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            DNI: {e.dni}
                            {e.nombreApoderado &&
                              String(e.nombreApoderado).trim() !== "" && (
                                <span className="ml-1 text-slate-500 dark:text-slate-400 font-medium">
                                  • Apoderado: {e.nombreApoderado}
                                </span>
                              )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          etiquetaUbicacion === "Sin Asignar"
                            ? "bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400"
                            : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60"
                        }`}
                      >
                        {etiquetaUbicacion}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {e.fechaNacimiento
                        ? new Date(e.fechaNacimiento).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          e.estado
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.estado ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {e.estado ? "Matriculado" : "Retirado"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => onEdit(e)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                          title="Editar Estudiante"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleCambiarEstado(e)}
                          className={`p-1.5 rounded-md transition-colors ${
                            e.estado
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          }`}
                          title={
                            e.estado
                              ? "Retirar / Desactivar"
                              : "Matricular / Activar"
                          }
                        >
                          <Power size={16} />
                        </button>

                        {!e.estado && (
                          <button
                            onClick={() => handleEliminar(e)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                            title="Eliminar Definitivamente"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
