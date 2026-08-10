import { Edit, Trash2, Power, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

export default function GradoCard({
  grado,
  secciones,
  onRefresh,
  onEditGrado,
  onAddSeccion,
  onEditSeccion,
}) {
  const handleCambiarEstadoGrado = async () => {
    const accion = grado.estado ? "desactivar" : "activar";
    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Grado?`,
      html: `El grado <b>${grado.nombre}</b> pasará a estar ${
        grado.estado ? "inactivo" : "activo"
      }.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: grado.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/academicos/grados/${grado.id}`, {
          nombre: grado.nombre,
          orden: grado.orden,
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

  const handleEliminarGrado = async () => {
    const result = await Swal.fire({
      title: "¿Eliminar este Grado?",
      html: `Estás a punto de eliminar <b>${grado.nombre}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Esta acción es irreversible.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/grados/${grado.id}`);
        toast.success("Grado eliminado correctamente");
        onRefresh();
      } catch {
        toast.error(
          "El grado tiene secciones asignadas que impiden su eliminación.",
        );
      }
    }
  };

  const handleCambiarEstadoSeccion = async (seccion) => {
    const accion = seccion.estado ? "desactivar" : "activar";
    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} Sección?`,
      html: `La sección <b>${seccion.nombre}</b> pasará a estado ${
        seccion.estado ? "inactivo" : "activo"
      }.`,
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
          gradoId: seccion.gradoId,
          estado: !seccion.estado,
        });
        toast.success(
          `Sección ${
            seccion.estado ? "desactivada" : "activada"
          } correctamente`,
        );
        onRefresh();
      } catch {
        toast.error("Error al cambiar el estado de la sección");
      }
    }
  };

  const handleEliminarSeccion = async (seccion) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta Sección?",
      html: `Estás a punto de eliminar la sección <b>${seccion.nombre}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Se podrían perder matrículas y notas.</span>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/academicos/secciones/${seccion.id}`);
        toast.success("Sección eliminada correctamente");
        onRefresh();
      } catch {
        toast.error(
          "La sección tiene alumnos asignados que impiden su eliminación.",
        );
      }
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col justify-between ${
        grado.estado
          ? "border-slate-200 dark:border-slate-700 hover:shadow-md"
          : "border-slate-200/60 dark:border-slate-700/60 opacity-80"
      }`}
    >
      <div>
        {/* Borde superior decorativo */}
        <div
          className="h-1.5 w-full transition-opacity"
          style={{
            backgroundColor: "var(--color-primary)",
            opacity: grado.estado ? 1 : 0.4,
          }}
        />

        {/* Encabezado del Grado */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">
              {grado.nombre}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditGrado(grado)}
                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                title="Editar Grado"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleCambiarEstadoGrado}
                className={`p-1.5 rounded-md transition-colors ${
                  grado.estado
                    ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                }`}
                title={grado.estado ? "Desactivar Grado" : "Activar Grado"}
              >
                <Power size={16} />
              </button>
              {!grado.estado && (
                <button
                  onClick={handleEliminarGrado}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                  title="Eliminar Grado"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              grado.estado
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {grado.estado ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Listado de Secciones Anidadas */}
        <div className="px-5 py-3 space-y-2.5">
          {secciones.length === 0 ? (
            <div className="py-6 text-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/60">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Sin secciones asignadas.
              </p>
            </div>
          ) : (
            secciones.map((sec) => (
              <div
                key={sec.id}
                className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  sec.estado
                    ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700"
                    : "bg-slate-100/60 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800 opacity-65"
                }`}
              >
                {/* Datos de la Sección */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-colors ${
                      sec.estado
                        ? "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Users size={15} />
                  </div>
                  <div>
                    <span
                      className={`block font-bold text-sm ${
                        sec.estado
                          ? "text-slate-800 dark:text-slate-100"
                          : "text-slate-500 dark:text-slate-400 line-through"
                      }`}
                    >
                      Sección {sec.nombre}
                    </span>
                    <span className="text-xs text-slate-400">
                      Capacidad: {sec.capacidadMaxima} alumnos
                    </span>
                  </div>
                </div>

                {/* Badges y Acciones Alineadas */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      sec.estado
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {sec.estado ? "Activo" : "Inactivo"}
                  </span>

                  <button
                    onClick={() => onEditSeccion(sec, grado.id)}
                    className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                    title="Editar Sección"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleCambiarEstadoSeccion(sec)}
                    className={`p-1 rounded transition-colors ${
                      sec.estado
                        ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    }`}
                    title={sec.estado ? "Desactivar" : "Activar"}
                  >
                    <Power size={14} />
                  </button>
                  {!sec.estado && (
                    <button
                      onClick={() => handleEliminarSeccion(sec)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                      title="Eliminar Definitivamente"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer de Tarjeta: Añadir Sección */}
      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <button
          onClick={() => onAddSeccion(grado.id)}
          className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus size={14} /> Añadir Sección
        </button>
      </div>
    </div>
  );
}
