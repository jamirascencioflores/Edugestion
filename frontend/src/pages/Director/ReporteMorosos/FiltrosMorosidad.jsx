//src/pages/Director/ReporteMorosos/FiltrosMorosidad.jsx
import { Search, Filter } from "lucide-react";

export default function FiltrosMorosidad({
  searchQuery,
  setSearchQuery,
  filtroGrado,
  setFiltroGrado,
  opcionesGrados = [],
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
      <div className="relative w-full sm:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por estudiante, DNI o apoderado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Filter size={16} className="text-slate-400" />
        <select
          value={filtroGrado}
          onChange={(e) => setFiltroGrado(e.target.value)}
          className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-xl px-3 py-2 focus:outline-none font-medium"
        >
          <option value="TODOS">Todos los grados</option>
          {opcionesGrados.map((grado, idx) => (
            <option key={idx} value={grado}>
              {grado}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
