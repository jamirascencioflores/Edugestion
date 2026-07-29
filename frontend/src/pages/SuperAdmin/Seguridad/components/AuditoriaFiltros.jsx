import { Search, Filter, RotateCcw } from "lucide-react";

export default function AuditoriaFiltros({
  busqueda,
  setBusqueda,
  filtroAccion,
  setFiltroAccion,
  filtroEntidad,
  setFiltroEntidad,
  entidadesDisponibles,
  onReset,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
      {/* Buscador */}
      <div className="relative w-full md:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por usuario, IP o detalle..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Selectores de Filtros */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
          <Filter size={14} /> Filtros:
        </div>

        <select
          value={filtroAccion}
          onChange={(e) => setFiltroAccion(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs focus:outline-none"
        >
          <option value="TODOS">Todas las Acciones</option>
          <option value="CREAR">CREAR</option>
          <option value="ACTUALIZAR">ACTUALIZAR</option>
          <option value="ELIMINAR">ELIMINAR</option>
          <option value="LOGIN">LOGIN</option>
        </select>

        <select
          value={filtroEntidad}
          onChange={(e) => setFiltroEntidad(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs focus:outline-none"
        >
          <option value="TODAS">Todas las Entidades</option>
          {entidadesDisponibles.map((ent) => (
            <option key={ent} value={ent}>
              {ent}
            </option>
          ))}
        </select>

        {(busqueda ||
          filtroAccion !== "TODOS" ||
          filtroEntidad !== "TODAS") && (
          <button
            onClick={onReset}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            title="Limpiar Filtros"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
