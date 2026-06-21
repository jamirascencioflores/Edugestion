import { Edit, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

// Agregamos 'grados' a los props para poder buscar el nombre
export default function TablaSecciones({
  secciones,
  grados,
  onRefresh,
  onEdit,
}) {
  const handleCambiarEstado = async (seccion) => {
    const accion = seccion.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} esta Sección?`,
      html: `La sección <b>${seccion.nombre}</b> pasará a estado ${seccion.estado ? "inactivo" : "activo"}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: seccion.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/academicos/secciones/${seccion.id}`, {
          nombre: seccion.nombre,
          capacidadMaxima: seccion.capacidadMaxima,
          gradoId: seccion.gradoId, // CORREGIDO: Ahora enviamos el ID correcto
          estado: !seccion.estado,
        });
        toast.success(
          `Sección ${seccion.estado ? "desactivada" : "activada"} correctamente`,
        );
        onRefresh();
      } catch {
        toast.error("Error al cambiar el estado de la sección");
      }
    }
  };

  const handleEliminar = async (seccion) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta Sección?",
      html: `Estás a punto de eliminar la sección <b>${seccion.nombre}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Esta acción es irreversible. Se podrían perder permanentemente las matrículas, notas y alumnos asociados a esta sección.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/secciones/${seccion.id}`);
        toast.success("Sección eliminada correctamente");
        onRefresh();
      } catch {
        toast.error(
          "Error: La sección tiene alumnos o registros asignados que impiden su eliminación.",
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
            <th className="px-6 py-4 font-medium">Grado Perteneciente</th>
            <th className="px-6 py-4 font-medium">Capacidad</th>
            <th className="px-6 py-4 font-medium">Estado</th>
            <th className="px-6 py-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {secciones.map((s) => {
            // Buscamos el nombre del grado coincidiendo los IDs
            const gradoAsignado = grados?.find((g) => g.id === s.gradoId);

            return (
              <tr
                key={s.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {s.nombre}
                </td>
                <td className="px-6 py-4">
                  {gradoAsignado ? gradoAsignado.nombre : "N/A"}
                </td>
                <td className="px-6 py-4">{s.capacidadMaxima} alumnos</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${s.estado ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                  >
                    {s.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={() => handleCambiarEstado(s)}
                    className={`${s.estado ? "text-amber-500 hover:text-amber-700" : "text-emerald-500 hover:text-emerald-700"} transition-colors`}
                    title={s.estado ? "Desactivar" : "Activar"}
                  >
                    <Power size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(s)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  {!s.estado && (
                    <button
                      onClick={() => handleEliminar(s)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
