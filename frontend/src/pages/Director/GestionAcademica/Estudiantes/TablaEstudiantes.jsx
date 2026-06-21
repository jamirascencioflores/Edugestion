import { Edit, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

export default function TablaEstudiantes({ estudiantes, onRefresh, onEdit }) {
  const handleCambiarEstado = async (estudiante) => {
    const accion = estudiante.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} este Estudiante?`,
      html: `El estudiante <b>${estudiante.nombres} ${estudiante.apellidos}</b> pasará a estado ${estudiante.estado ? "inactivo" : "activo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: estudiante.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // Hacemos el PUT enviando todo el objeto, pero invirtiendo el estado
        await api.put(`/academicos/estudiantes/${estudiante.id}`, {
          ...estudiante,
          estado: !estudiante.estado,
        });
        toast.success(
          `Estudiante ${estudiante.estado ? "desactivado" : "activado"} correctamente`,
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
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay estudiantes registrados. Haz clic en "Nuevo Estudiante" para
        comenzar.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-x-auto border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 font-medium">DNI</th>
            <th className="px-6 py-4 font-medium">Estudiante</th>
            <th className="px-6 py-4 font-medium">F. Nacimiento</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {estudiantes.map((e) => (
            <tr
              key={e.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                {e.dni}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-white">
                  {e.nombres} {e.apellidos}
                </div>
                {e.emailInstitucional && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    {e.emailInstitucional}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                {new Date(e.fechaNacimiento).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    e.estado
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {e.estado ? "Matriculado" : "Retirado"}
                </span>
              </td>
              <td className="px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => handleCambiarEstado(e)}
                  className={`${
                    e.estado
                      ? "text-amber-500 hover:text-amber-700"
                      : "text-emerald-500 hover:text-emerald-700"
                  } transition-colors`}
                  title={e.estado ? "Retirar/Desactivar" : "Matricular/Activar"}
                >
                  <Power size={18} />
                </button>
                <button
                  onClick={() => onEdit(e)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                {!e.estado && (
                  <button
                    onClick={() => handleEliminar(e)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
