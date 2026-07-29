import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Wrench,
  Edit3,
  Trash2,
} from "lucide-react";

export default function AnuncioCard({
  anuncio,
  onToggleEstado,
  onEdit,
  onDelete,
}) {
  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case "URGENTE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <AlertTriangle size={13} /> Urgente
          </span>
        );
      case "MANTENIMIENTO":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Wrench size={13} /> Mantenimiento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Info size={13} /> Informativo
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-4 transition-all ${
        !anuncio.activo ? "opacity-60 bg-slate-50 dark:bg-slate-900/50" : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {getTipoBadge(anuncio.tipo)}
          <span className="text-[11px] font-medium text-slate-400">
            {anuncio.fechaCreacion
              ? new Date(anuncio.fechaCreacion).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Reciente"}
          </span>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
            {anuncio.titulo}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {anuncio.mensaje}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center">
        <button
          onClick={() => onToggleEstado(anuncio.id, anuncio.activo)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
            anuncio.activo
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
              : "text-slate-500 bg-slate-100 dark:bg-slate-700/50"
          }`}
        >
          {anuncio.activo ? (
            <>
              <CheckCircle2 size={14} /> Activo
            </>
          ) : (
            <>
              <XCircle size={14} /> Inactivo
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(anuncio)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Editar Anuncio"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(anuncio.id)}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Eliminar Anuncio"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
