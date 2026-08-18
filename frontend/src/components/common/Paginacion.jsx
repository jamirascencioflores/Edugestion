// src/components/common/Paginacion.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Paginacion = ({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
  totalRegistros,
  registrosPorPagina,
}) => {
  if (totalPaginas <= 1) return null;

  const inicio = (paginaActual - 1) * registrosPorPagina + 1;
  const fin = Math.min(paginaActual * registrosPorPagina, totalRegistros);

  const handleCambiar = (nuevaPagina) => {
    if (
      nuevaPagina >= 1 &&
      nuevaPagina <= totalPaginas &&
      nuevaPagina !== paginaActual
    ) {
      onCambiarPagina(nuevaPagina);
      // 👈 Se quitó window.scrollTo para que la pantalla no se desplace
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
      <div>
        Mostrando{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {inicio}
        </span>{" "}
        a{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {fin}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {totalRegistros}
        </span>{" "}
        resultados
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => handleCambiar(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
          <button
            key={pagina}
            onClick={() => handleCambiar(pagina)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
              paginaActual === pagina
                ? "text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
            style={
              paginaActual === pagina
                ? { backgroundColor: "var(--color-primary)" }
                : {}
            }
          >
            {pagina}
          </button>
        ))}

        <button
          onClick={() => handleCambiar(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
