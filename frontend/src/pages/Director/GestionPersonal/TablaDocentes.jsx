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
          <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
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
                  className="px-6 py-10 text-center text-slate-400"
                >
                  No hay docentes registrados en tu colegio.
                </td>
              </tr>
            ) : (
              docentes.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {d.nombres.charAt(0)}
                        {d.apellidos.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          {d.nombres} {d.apellidos}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail size={12} /> {d.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                    {d.documentoIdentidad}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-semibold">
                      {d.especialidad || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${d.estado ? "bg-emerald-500" : "bg-slate-400"}`}
                      ></div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {d.estado ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3 text-slate-400">
                      <button
                        onClick={() => onEdit(d)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onToggleEstado(d)}
                        className={`${d.estado ? "hover:text-orange-500" : "hover:text-emerald-500"} transition-colors`}
                        title={
                          d.estado ? "Desactivar acceso" : "Activar acceso"
                        }
                      >
                        <Power size={16} />
                      </button>
                      {/* Solo mostramos el botón de eliminar si el docente está inactivo */}
                      {!d.estado && (
                        <button
                          onClick={() => onDelete(d)}
                          className="hover:text-red-500 transition-colors"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
