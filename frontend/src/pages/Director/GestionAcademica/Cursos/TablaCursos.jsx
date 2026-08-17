// src/pages/Director/GestionAcademica/Cursos/TablaCursos.jsx
import {
  Edit,
  Trash2,
  Power,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Palette,
  Music,
  Languages,
  Laptop,
  Activity,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import api from "../../../../api/axiosConfig";

function IconoMateria({ nombre = "", activo = true }) {
  const nameLower = nombre.toLowerCase();

  let Icon = BookOpen;
  let bgClass =
    "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300";

  if (
    nameLower.includes("computaci") ||
    nameLower.includes("informátic") ||
    nameLower.includes("robótic") ||
    nameLower.includes("tecnolog") ||
    nameLower.includes("sistem") ||
    nameLower.includes("digital")
  ) {
    Icon = Laptop;
    bgClass =
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300";
  } else if (
    nameLower.includes("matemátic") ||
    nameLower.includes("matemat") ||
    nameLower.includes("álgebra") ||
    nameLower.includes("trigonometr") ||
    nameLower.includes("geometr") ||
    nameLower.includes("físic") ||
    nameLower.includes("cálculo") ||
    nameLower.includes("estadístic")
  ) {
    Icon = Calculator;
    bgClass =
      "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300";
  } else if (
    nameLower.includes("cienci") ||
    nameLower.includes("químic") ||
    nameLower.includes("biolog") ||
    nameLower.includes("ambient") ||
    nameLower.includes("cta") ||
    nameLower.includes("anatom")
  ) {
    Icon = FlaskConical;
    bgClass =
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400";
  } else if (
    nameLower.includes("historia") ||
    nameLower.includes("geograf") ||
    nameLower.includes("social") ||
    nameLower.includes("cívic") ||
    nameLower.includes("dpcc") ||
    nameLower.includes("econom") ||
    nameLower.includes("psicolog") ||
    nameLower.includes("filosof")
  ) {
    Icon = Globe;
    bgClass =
      "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400";
  } else if (
    nameLower.includes("inglés") ||
    nameLower.includes("ingles") ||
    nameLower.includes("idiom") ||
    nameLower.includes("francés") ||
    nameLower.includes("quechua")
  ) {
    Icon = Languages;
    bgClass = "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300";
  } else if (
    nameLower.includes("arte") ||
    nameLower.includes("dibujo") ||
    nameLower.includes("plástic") ||
    nameLower.includes("teatro") ||
    nameLower.includes("danza")
  ) {
    Icon = Palette;
    bgClass =
      "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300";
  } else if (nameLower.includes("músic")) {
    Icon = Music;
    bgClass =
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300";
  } else if (
    nameLower.includes("físic") ||
    nameLower.includes("deport") ||
    nameLower.includes("psicomotric")
  ) {
    Icon = Activity;
    bgClass =
      "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300";
  } else if (
    nameLower.includes("religi") ||
    nameLower.includes("tutor") ||
    nameLower.includes("valores") ||
    nameLower.includes("ética")
  ) {
    Icon = HeartHandshake;
    bgClass =
      "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300";
  }

  if (!activo) {
    bgClass =
      "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400";
  }

  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700 ${bgClass}`}
    >
      <Icon size={18} />
    </div>
  );
}

export default function TablaCursos({ cursos, onRefresh, onEdit }) {
  const handleCambiarEstado = async (curso) => {
    const accion = curso.estado ? "desactivar" : "activar";

    const result = await Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} este Curso?`,
      html: `El curso <b>${curso.nombre}</b> pasará a estado ${
        curso.estado ? "inactivo" : "activo"
      }.`,
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
      html: `Estás a punto de eliminar el curso <b>${curso.nombre}</b>.<br/><br/><span style="color: #ef4444; font-size: 0.9em;">⚠️ <b>Atención:</b> Esta acción es irreversible. Podrías perder el historial vinculado.</span>`,
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

  if (cursos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400">
        No hay cursos que coincidan con la búsqueda.
      </div>
    );
  }

  return (
    <>
      {/* VISTA MÓVIL (Cards) - Se activa en pantallas < lg */}
      <div className="lg:hidden space-y-3">
        {cursos.map((c) => (
          <div
            key={c.id}
            className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 transition-opacity ${
              !c.estado ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <IconoMateria nombre={c.nombre} activo={c.estado} />
                <div className="min-w-0">
                  <p
                    className={`font-bold text-sm truncate ${
                      c.estado
                        ? "text-slate-800 dark:text-slate-100"
                        : "text-slate-500 dark:text-slate-400 line-through"
                    }`}
                  >
                    {c.nombre}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {c.descripcion || "Sin descripción"}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  c.estado
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    c.estado ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {c.estado ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={() => onEdit(c)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg transition-colors"
              >
                <Edit size={14} /> Editar
              </button>

              <button
                onClick={() => handleCambiarEstado(c)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  c.estado
                    ? "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
                    : "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                }`}
              >
                <Power size={14} /> {c.estado ? "Desactivar" : "Activar"}
              </button>

              {!c.estado && (
                <button
                  onClick={() => handleEliminar(c)}
                  className="p-1.5 text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-lg transition-colors"
                  title="Eliminar Definitivamente"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VISTA DESKTOP (Tabla tradicional) - Se activa en pantallas >= lg */}
      <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
              <tr>
                <th className="px-6 py-4">Curso</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {cursos.map((c) => (
                <tr
                  key={c.id}
                  className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60 ${
                    !c.estado
                      ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <IconoMateria nombre={c.nombre} activo={c.estado} />
                      <div>
                        <p
                          className={`font-bold ${
                            c.estado
                              ? "text-slate-800 dark:text-slate-100"
                              : "text-slate-500 dark:text-slate-400 line-through"
                          }`}
                        >
                          {c.nombre}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-md truncate">
                    {c.descripcion || "Sin descripción"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        c.estado
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.estado ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {c.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1">
                      <button
                        onClick={() => onEdit(c)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                        title="Editar Curso"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleCambiarEstado(c)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          c.estado
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        }`}
                        title={c.estado ? "Desactivar" : "Activar"}
                      >
                        <Power size={16} />
                      </button>

                      {!c.estado && (
                        <button
                          onClick={() => handleEliminar(c)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Eliminar Definitivamente"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
