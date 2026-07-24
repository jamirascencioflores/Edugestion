import { useState } from "react";
import {
  Download,
  Filter,
  Edit,
  Trash2,
  Ban,
  Power,
  ExternalLink,
} from "lucide-react";
// IMPORTA LA FUNCIÓN (Ajusta la ruta si lo pusiste en otra carpeta)
import { exportarColegiosExcel } from "./exportUtils";

export default function TablaColegios({
  colegios,
  onEdit,
  onToggleEstado,
  onDelete,
}) {
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroPlan, setFiltroPlan] = useState("TODOS");

  const colegiosFiltrados = colegios.filter((c) => {
    const matchEstado =
      filtroEstado === "TODOS"
        ? true
        : filtroEstado === "ACTIVO"
          ? c.estado === true
          : c.estado === false;
    const matchPlan = filtroPlan === "TODOS" ? true : c.plan === filtroPlan;
    return matchEstado && matchPlan;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
        <h3 className="font-bold">Colegios Registrados</h3>
        <div className="flex gap-2 relative">
          {/* BOTÓN DESCARGAR EXCEL */}
          <button
            onClick={() => exportarColegiosExcel(colegiosFiltrados)}
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Exportar a Excel"
          >
            <Download size={18} />
          </button>

          {/* BOTÓN FILTROS */}
          <button
            onClick={() => setShowFiltros(!showFiltros)}
            className={`p-2 transition-colors ${
              showFiltros || filtroEstado !== "TODOS" || filtroPlan !== "TODOS"
                ? "text-primary bg-primary/10 rounded-lg"
                : "text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Filtrar tabla"
          >
            <Filter size={18} />
          </button>

          {/* MENÚ DESPLEGABLE DE FILTROS */}
          {showFiltros && (
            <div className="absolute right-0 top-10 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Estado
                  </label>
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="TODOS">Todos los estados</option>
                    <option value="ACTIVO">Activos</option>
                    <option value="INACTIVO">Inactivos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Plan
                  </label>
                  <select
                    value={filtroPlan}
                    onChange={(e) => setFiltroPlan(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="TODOS">Todos los planes</option>
                    <option value="BÁSICO">Básico</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
                {/* Botón para limpiar filtros si hay alguno activo */}
                {(filtroEstado !== "TODOS" || filtroPlan !== "TODOS") && (
                  <button
                    onClick={() => {
                      setFiltroEstado("TODOS");
                      setFiltroPlan("TODOS");
                    }}
                    className="w-full text-xs text-red-500 font-medium hover:underline pt-2"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Colegio / Institución</th>
              <th className="px-6 py-4">Subdominio</th>
              <th className="px-6 py-4">Responsable</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {colegiosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-slate-400"
                >
                  No se encontraron colegios con esos criterios.
                </td>
              </tr>
            ) : (
              colegiosFiltrados.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* COLEGIO */}
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                    {c.nombre}
                  </td>

                  {/* SUBDOMINIO */}
                  <td className="px-6 py-4 font-medium text-slate-500">
                    {c.subdominio}.edugestion.io
                  </td>

                  {/* RESPONSABLE */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {c.responsableNombre !== "Sin asignar" ? (
                          c.responsableNombre
                        ) : (
                          <span className="italic text-slate-400">
                            Sin asignar
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-500 italic">
                        {c.emailResponsable || c.responsableEmail || ""}
                      </span>
                    </div>
                  </td>

                  {/* PLAN */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        c.plan === "PREMIUM"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : c.plan === "BÁSICO"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {c.plan || "N/A"}
                    </span>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          c.estado ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      ></div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {c.estado ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3 text-slate-400">
                      <button
                        onClick={() => onEdit(c)}
                        className="hover:text-primary transition-colors"
                        title="Editar Colegio"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => onToggleEstado(c.id, c.estado)}
                        className={`${
                          c.estado
                            ? "hover:text-orange-500"
                            : "hover:text-emerald-500"
                        } transition-colors`}
                        title={c.estado ? "Suspender" : "Activar"}
                      >
                        {c.estado ? <Ban size={16} /> : <Power size={16} />}
                      </button>

                      {!c.estado && (
                        <button
                          onClick={() => onDelete(c.id)}
                          className="hover:text-red-500 transition-colors"
                          title="Eliminar definitivamente"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <a
                        href={`http://${c.subdominio}.localhost:5173/login`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                        title="Abrir portal del colegio"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
