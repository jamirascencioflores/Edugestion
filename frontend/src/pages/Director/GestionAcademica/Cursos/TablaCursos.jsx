import { Edit, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

export default function TablaCursos({ cursos, onRefresh, onEdit }) {
  const handleCambiarEstado = async (curso) => {
    const accion = curso.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} este Curso?`,
      html: `El curso <b>${curso.nombre}</b> pasará a estado ${curso.estado ? "inactivo" : "activo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: curso.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/academicos/cursos/${curso.id}`, {
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          estado: !curso.estado,
        });
        toast.success(
          `Curso ${curso.estado ? "desactivado" : "activado"} correctamente`,
        );
        onRefresh();
      } catch {
        toast.error("Error al cambiar el estado del curso");
      }
    }
  };

  const handleEliminar = async (curso) => {
    const result = await Swal.fire({
      title: "¿Eliminar este Curso?",
      html: `Estás a punto de eliminar el curso <b>${curso.nombre}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Esta acción es irreversible. Podrías perder permanentemente el historial de calificaciones y asignaciones vinculadas a este curso.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/cursos/${curso.id}`);
        toast.success("Curso eliminado correctamente");
        onRefresh();
      } catch {
        toast.error(
          "Error: El curso podría estar asignado a una malla curricular.",
        );
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 font-medium">Nombre</th>
            <th className="px-6 py-4 font-medium">Descripción</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {cursos.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                No hay cursos registrados.
              </td>
            </tr>
          ) : (
            cursos.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {c.nombre}
                </td>
                <td className="px-6 py-4 truncate max-w-[200px]">
                  {c.descripcion || "Sin descripción"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${c.estado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                  >
                    {c.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={() => handleCambiarEstado(c)}
                    className={`${c.estado ? "text-amber-500 hover:text-amber-700" : "text-emerald-500 hover:text-emerald-700"} transition-colors`}
                    title={c.estado ? "Desactivar" : "Activar"}
                  >
                    <Power size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(c)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  {!c.estado && (
                    <button
                      onClick={() => handleEliminar(c)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
