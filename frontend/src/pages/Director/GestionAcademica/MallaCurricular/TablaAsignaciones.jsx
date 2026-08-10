import { Edit, Trash2, Power, UserX } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

export default function TablaAsignaciones({
  asignaciones,
  cursos,
  docentes,
  onRefresh,
  onEdit,
}) {
  const handleCambiarEstado = async (asignacion, cursoNombre) => {
    const accion = asignacion.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Asignación?`,
      html: `El curso <b>${cursoNombre}</b> pasará a estar ${asignacion.estado ? "inactivo" : "activo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: asignacion.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/academicos/asignaciones/${asignacion.id}`, {
          docenteId: asignacion.docenteId,
          estado: !asignacion.estado,
        });
        toast.success(
          `Asignación ${asignacion.estado ? "desactivada" : "activada"} correctamente`,
        );
        onRefresh();
      } catch {
        toast.error("Error al cambiar el estado de la asignación");
      }
    }
  };

  const handleEliminar = async (asignacion, cursoNombre) => {
    const result = await Swal.fire({
      title: "¿Eliminar Definitivamente?",
      html: `Quitarás <b>${cursoNombre}</b> por completo de la malla curricular.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Peligro:</b> Se romperá todo enlace histórico de notas de alumnos en este curso.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/asignaciones/${asignacion.id}`);
        toast.success("Asignación eliminada con éxito");
        onRefresh();
      } catch {
        toast.error("Error al eliminar la asignación");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 font-semibold">Curso</th>
            <th className="px-6 py-4 font-semibold">Docente Asignado</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {asignaciones.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
              >
                No hay cursos configurados en esta aula.
              </td>
            </tr>
          ) : (
            asignaciones.map((a) => {
              const cursoObj = cursos.find((c) => c.id === a.cursoId);
              const docenteObj = docentes.find(
                (d) => d.usuarioId === a.docenteId,
              );
              const cursoNombre = cursoObj
                ? cursoObj.nombre
                : "Curso no encontrado";

              const iniciales = docenteObj
                ? `${docenteObj.nombres[0] || ""}${docenteObj.apellidos[0] || ""}`
                : "";

              return (
                <tr
                  key={a.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {cursoNombre}
                  </td>
                  <td className="px-6 py-4">
                    {docenteObj ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs">
                          {iniciales}
                        </div>
                        <div>
                          <span className="block font-medium text-slate-800 dark:text-slate-200">
                            {docenteObj.nombres} {docenteObj.apellidos}
                          </span>
                          <span className="text-xs text-slate-400">
                            {docenteObj.email || "Sin email"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        <UserX size={14} /> Sin Docente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.estado
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {a.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleCambiarEstado(a, cursoNombre)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        a.estado
                          ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      }`}
                      title={a.estado ? "Desactivar" : "Activar"}
                    >
                      <Power size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(a)}
                      className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                      title="Reasignar Docente"
                    >
                      <Edit size={18} />
                    </button>
                    {!a.estado && (
                      <button
                        onClick={() => handleEliminar(a, cursoNombre)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        title="Eliminar definitivamente"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
