import { Search, Filter } from "lucide-react";

export default function FiltrosMorosidad({
  searchQuery,
  setSearchQuery,
  filtroGrado,
  setFiltroGrado,
  opcionesGrados = [],
}) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por estudiante, DNI o apoderado..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Filter size={16} className="text-slate-400" />
        <select
          value={filtroGrado}
          onChange={(e) => setFiltroGrado(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none"
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
