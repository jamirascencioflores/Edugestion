import { Edit, Trash2, Power } from "lucide-react";
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
        // Se cambia a PUT con el ID en la URL y el payload del AsignacionActualizarDTO
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
        toast.success("Asignación destruida con éxito");
        onRefresh();
      } catch {
        toast.error("Error al eliminar la asignación");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 font-medium">Curso</th>
            <th className="px-6 py-4 font-medium">Docente</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {asignaciones.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
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

              return (
                <tr
                  key={a.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {cursoNombre}
                  </td>
                  <td className="px-6 py-4">
                    {docenteObj
                      ? `${docenteObj.nombres} ${docenteObj.apellidos}`
                      : "No asignado"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${a.estado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                    >
                      {a.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleCambiarEstado(a, cursoNombre)}
                      className={`${a.estado ? "text-amber-500 hover:text-amber-700" : "text-emerald-500 hover:text-emerald-700"} transition-colors`}
                      title={a.estado ? "Desactivar" : "Activar"}
                    >
                      <Power size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(a)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Reasignar Docente"
                    >
                      <Edit size={18} />
                    </button>
                    {!a.estado && (
                      <button
                        onClick={() => handleEliminar(a, cursoNombre)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
