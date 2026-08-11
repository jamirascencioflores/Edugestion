import { Search, Filter } from "lucide-react";

export default function FiltrosAnuncios({
  searchQuery,
  setSearchQuery,
  filtroPrioridad,
  setFiltroPrioridad,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por título o contenido..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-800 dark:text-slate-100"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Filter size={16} className="text-slate-400" />
        <select
          value={filtroPrioridad}
          onChange={(e) => setFiltroPrioridad(e.target.value)}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="TODOS">Todas las prioridades</option>
          <option value="ALTA">Alta Prioridad</option>
          <option value="MEDIA">Prioridad Media</option>
          <option value="BAJA">Prioridad Baja</option>
        </select>
      </div>
    </div>
  );
}
