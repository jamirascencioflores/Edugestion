import { Edit, Trash2, Power } from "lucide-react";
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
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay estudiantes registrados con los criterios seleccionados.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
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

              // Búsqueda con Number(...) para prevenir errores string vs number
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
                  {/* Estudiante Info + Avatar */}
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

                  {/* Grado y Sección */}
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

                  {/* F. Nacimiento */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {e.fechaNacimiento
                      ? new Date(e.fechaNacimiento).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Estado */}
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

                  {/* Acciones */}
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
  );
}
