// src/pages/Director/GestionAcademica/MallaCurricular/TablaAsignaciones.jsx
import { Edit, Trash2, Power, UserX, BookOpen } from "lucide-react";
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
      html: `El curso <b>${cursoNombre}</b> pasará a estar ${
        asignacion.estado ? "inactivo" : "activo"
      }.`,
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
          `Asignación ${
            asignacion.estado ? "desactivada" : "activada"
          } correctamente`,
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

  if (asignaciones.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay cursos configurados en esta aula.
      </div>
    );
  }

  return (
    <>
      {/* VISTA MÓVIL (Cards) - Se activa en pantallas < lg */}
      <div className="lg:hidden space-y-3">
        {asignaciones.map((a) => {
          const cursoObj = cursos.find((c) => c.id === a.cursoId);
          const docenteObj = docentes.find((d) => d.usuarioId === a.docenteId);
          const cursoNombre = cursoObj
            ? cursoObj.nombre
            : "Curso no encontrado";

          const iniciales = docenteObj
            ? `${docenteObj.nombres?.[0] || ""}${docenteObj.apellidos?.[0] || ""}`.toUpperCase()
            : "";

          return (
            <div
              key={a.id}
              className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 transition-opacity ${
                !a.estado
                  ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                  : ""
              }`}
            >
              {/* Header: Curso y Estado */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <h3
                    className={`font-bold text-sm truncate ${
                      a.estado
                        ? "text-slate-800 dark:text-slate-100"
                        : "text-slate-500 dark:text-slate-400 line-through"
                    }`}
                  >
                    {cursoNombre}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    a.estado
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      a.estado ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {a.estado ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Docente Asignado */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                {docenteObj ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {iniciales}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {docenteObj.nombres} {docenteObj.apellidos}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {docenteObj.email || "Sin correo"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400">
                    <UserX size={13} /> Sin Docente asignado
                  </span>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  onClick={() => onEdit(a)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg transition-colors"
                >
                  <Edit size={14} /> Reasignar
                </button>

                <button
                  onClick={() => handleCambiarEstado(a, cursoNombre)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    a.estado
                      ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
                      : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                  }`}
                >
                  <Power size={14} /> {a.estado ? "Desactivar" : "Activar"}
                </button>

                {!a.estado && (
                  <button
                    onClick={() => handleEliminar(a, cursoNombre)}
                    className="p-1.5 text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-lg transition-colors"
                    title="Eliminar Definitivamente"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* VISTA DESKTOP (Tabla tradicional) - Se activa en pantallas >= lg */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl shadow-xs overflow-hidden border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
            <tr>
              <th className="px-6 py-4">Curso</th>
              <th className="px-6 py-4">Docente Asignado</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {asignaciones.map((a) => {
              const cursoObj = cursos.find((c) => c.id === a.cursoId);
              const docenteObj = docentes.find(
                (d) => d.usuarioId === a.docenteId,
              );
              const cursoNombre = cursoObj
                ? cursoObj.nombre
                : "Curso no encontrado";

              const iniciales = docenteObj
                ? `${docenteObj.nombres?.[0] || ""}${docenteObj.apellidos?.[0] || ""}`.toUpperCase()
                : "";

              return (
                <tr
                  key={a.id}
                  className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60 ${
                    !a.estado
                      ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                    {cursoNombre}
                  </td>
                  <td className="px-6 py-4">
                    {docenteObj ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
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
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        a.estado
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          a.estado ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {a.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() => onEdit(a)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                        title="Reasignar Docente"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleCambiarEstado(a, cursoNombre)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          a.estado
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        }`}
                        title={a.estado ? "Desactivar" : "Activar"}
                      >
                        <Power size={16} />
                      </button>

                      {!a.estado && (
                        <button
                          onClick={() => handleEliminar(a, cursoNombre)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Eliminar definitivamente"
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
    </>
  );
}
