import { Edit, Trash2, Mail, Power } from "lucide-react";

export default function TablaDocentes({
  docentes,
  onEdit,
  onDelete,
  onToggleEstado,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/80 dark:border-slate-700/80">
            <tr>
              <th className="px-6 py-4">Docente</th>
              <th className="px-6 py-4">Documento</th>
              <th className="px-6 py-4">Especialidad</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {docentes.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-slate-400 dark:text-slate-500"
                >
                  No se encontraron docentes con los criterios ingresados.
                </td>
              </tr>
            ) : (
              docentes.map((d) => {
                const iniciales =
                  `${d.nombres?.[0] || ""}${d.apellidos?.[0] || ""}`.toUpperCase();

                return (
                  <tr
                    key={d.id}
                    className={`transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/60 ${
                      !d.estado
                        ? "opacity-75 bg-slate-50/40 dark:bg-slate-900/20"
                        : ""
                    }`}
                  >
                    {/* Docente Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                            d.estado
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {iniciales}
                        </div>
                        <div>
                          <p
                            className={`font-bold ${
                              d.estado
                                ? "text-slate-800 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400 line-through"
                            }`}
                          >
                            {d.nombres} {d.apellidos}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {d.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                      {d.documentoIdentidad}
                    </td>

                    {/* Especialidad Badge */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                        {d.especialidad || "General"}
                      </span>
                    </td>

                    {/* Estado Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          d.estado
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            d.estado ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {d.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    {/* Acciones Semánticas */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-1">
                        {/* Editar */}
                        <button
                          onClick={() => onEdit(d)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                          title="Editar Docente"
                        >
                          <Edit size={16} />
                        </button>

                        {/* Power / Toggle Estado */}
                        <button
                          onClick={() => onToggleEstado(d)}
                          className={`p-1.5 rounded-md transition-colors ${
                            d.estado
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          }`}
                          title={
                            d.estado ? "Desactivar Acceso" : "Activar Acceso"
                          }
                        >
                          <Power size={16} />
                        </button>

                        {/* Eliminar (Solo visible si inactivo) */}
                        {!d.estado && (
                          <button
                            onClick={() => onDelete(d)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                            title="Eliminar Definitivamente"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
