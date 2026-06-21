export default function TablaTarifario({ tarifarios, grados, loading }) {
  // Función para cruzar el gradoId del tarifario con el nombre real del grado
  const getNombreGrado = (gradoId) => {
    const grado = grados.find((g) => g.id === gradoId);
    return grado ? grado.nombre : "Grado Desconocido";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Grado
            </th>
            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Monto Mensual
            </th>
            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Año Escolar
            </th>
            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {tarifarios.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-8 text-center text-slate-500 dark:text-slate-400"
              >
                No hay tarifas configuradas para este año.
              </td>
            </tr>
          ) : (
            tarifarios.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 font-medium text-slate-900 dark:text-white">
                  {getNombreGrado(t.gradoId)}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  S/ {Number(t.montoMensual).toFixed(2)}
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {t.anioEscolar}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${t.estado ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                  >
                    {t.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
