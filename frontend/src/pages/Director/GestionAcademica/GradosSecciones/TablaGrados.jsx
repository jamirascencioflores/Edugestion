import { Edit, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

export default function TablaGrados({ grados, onRefresh, onEdit }) {
  const handleCambiarEstado = async (grado) => {
    const accion = grado.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} este Grado?`,
      html: `El grado <b>${grado.nombre}</b> pasará a estado ${grado.estado ? "inactivo" : "activo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: grado.estado ? "#f59e0b" : "#10b981", // Naranja para desactivar, Verde para activar
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/academicos/grados/${grado.id}`, {
          nombre: grado.nombre,
          estado: !grado.estado,
        });
        toast.success(
          `Grado ${grado.estado ? "desactivado" : "activado"} correctamente`,
        );
        onRefresh();
      } catch {
        toast.error("Error al cambiar el estado del grado");
      }
    }
  };

  const handleEliminar = async (grado) => {
    const result = await Swal.fire({
      title: "¿Eliminar este Grado?",
      html: `Estás a punto de eliminar <b>${grado.nombre}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Esta acción es irreversible. Se podrían perder permanentemente las secciones y registros académicos asociados a este grado.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/grados/${grado.id}`);
        toast.success("Grado eliminado correctamente");
        onRefresh();
      } catch {
        toast.error(
          "Error: El grado tiene secciones o registros asignados que impiden su eliminación.",
        );
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 font-medium">ID</th>
            <th className="px-6 py-4 font-medium">Nombre del Grado</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {grados.map((g) => (
            <tr
              key={g.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-6 py-4">{g.id}</td>
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                {g.nombre}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${g.estado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                >
                  {g.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => handleCambiarEstado(g)}
                  className={`${g.estado ? "text-amber-500 hover:text-amber-700" : "text-emerald-500 hover:text-emerald-700"} transition-colors`}
                  title={g.estado ? "Desactivar" : "Activar"}
                >
                  <Power size={18} />
                </button>
                <button
                  onClick={() => onEdit(g)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                {!g.estado && (
                  <button
                    onClick={() => handleEliminar(g)}
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
