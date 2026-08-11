import { Megaphone, Trash2, Clock, Globe } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import api from "../../../api/axiosConfig";

export default function ListaAnuncios({
  anuncios = [],
  grados = [],
  secciones = [],
  onRefresh,
}) {
  const handleEliminar = async (anuncio) => {
    const result = await Swal.fire({
      title: "¿Archivar este comunicado?",
      html: `El anuncio <b>"${anuncio.titulo}"</b> dejará de ser visible para los padres.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, archivar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/comunicaciones/anuncios/${anuncio.id}`);
        toast.success("Comunicado archivado correctamente");
        onRefresh();
      } catch {
        toast.error("Error al archivar el comunicado");
      }
    }
  };

  if (!anuncios || anuncios.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400 space-y-3">
        <Megaphone
          size={36}
          className="mx-auto text-slate-300 dark:text-slate-600"
        />
        <p className="font-semibold text-base text-slate-600 dark:text-slate-300">
          No hay comunicados publicados
        </p>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Crea un nuevo comunicado para enviar notificaciones generales a toda
          la comunidad educativa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {anuncios.map((item) => {
        const gradoTarget = grados.find(
          (g) => Number(g.id) === Number(item.gradoId),
        );
        const seccionTarget = secciones.find(
          (s) => Number(s.id) === Number(item.seccionId),
        );

        let alcanceTexto = "Todo el Colegio";
        if (gradoTarget && seccionTarget) {
          alcanceTexto = `${gradoTarget.nombre} - "${seccionTarget.nombre}"`;
        } else if (gradoTarget) {
          alcanceTexto = `Todo ${gradoTarget.nombre}`;
        }

        const fechaFormateada = item.fechaPublicacion
          ? new Date(item.fechaPublicacion).toLocaleString("es-PE", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "Reciente";

        return (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Badge Prioridad */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    item.prioridad === "ALTA"
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
                      : item.prioridad === "MEDIA"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                  }`}
                >
                  Prioridad {item.prioridad}
                </span>

                {/* Badge Alcance */}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800 flex items-center gap-1">
                  <Globe size={12} /> {alcanceTexto}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {fechaFormateada}
                </span>
                <button
                  onClick={() => handleEliminar(item)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Archivar Comunicado"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {item.titulo}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {item.contenido}
            </p>
          </div>
        );
      })}
    </div>
  );
}
