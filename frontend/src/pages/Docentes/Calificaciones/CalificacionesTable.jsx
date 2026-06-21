import { Save } from "lucide-react";

export default function CalificacionesTable({
  alumnos,
  periodos,
  periodoActivo,
  cursoId,
  historialNotas,
  notasEditables,
  onNotaChange,
  onGuardar,
}) {
  // Función inteligente para calcular promedios (Soporta numérico 0-20 y literales peruanos AD-C)
  const obtenerPromedioHtml = (alumnoId) => {
    const notasDefinitivas = periodos
      .map((p) => {
        const notaGuardada = historialNotas.find(
          (h) =>
            h.estudianteId === alumnoId &&
            h.periodo?.toString() === p.id?.toString(),
        );
        return notaGuardada ? notaGuardada.valor?.toUpperCase().trim() : null;
      })
      .filter(Boolean);

    if (notasDefinitivas.length === 0)
      return <span className="text-slate-400">-</span>;

    const esNumerico = notasDefinitivas.every((n) => !isNaN(n));

    if (esNumerico) {
      const suma = notasDefinitivas.reduce((acc, val) => acc + Number(val), 0);
      const prom = (suma / notasDefinitivas.length).toFixed(1);
      return (
        <span
          className={`font-bold ${Number(prom) < 11 ? "text-red-500" : "text-emerald-500"}`}
        >
          {prom}
        </span>
      );
    }

    const pesos = { AD: 4, A: 3, B: 2, C: 1 };
    const inversos = { 4: "AD", 3: "A", 2: "B", 1: "C" };
    let totalPeso = 0;

    notasDefinitivas.forEach((n) => (totalPeso += pesos[n] || 2));
    const promLetra =
      inversos[Math.round(totalPeso / notasDefinitivas.length)] || "B";

    return (
      <span
        className={`font-bold ${promLetra === "C" ? "text-red-500" : promLetra === "AD" ? "text-indigo-500" : "text-emerald-500"}`}
      >
        {promLetra}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {/* 2. Actualizado a min-w-60 */}
              <th className="px-6 py-4 font-medium min-w-60">Estudiante</th>
              {periodos.map((p) => (
                <th
                  key={p.id}
                  className="px-4 py-4 font-medium text-center w-28"
                >
                  {p.nombre?.replace("Año Escolar ", "")}
                </th>
              ))}
              <th className="px-4 py-4 font-medium text-center w-24 bg-slate-100/50 dark:bg-slate-900/30">
                PROM
              </th>
              {/* 3. Actualizado a min-w-50 */}
              <th className="px-6 py-4 font-medium min-w-50">
                Observaciones (Periodo Activo)
              </th>
              <th className="px-6 py-4 font-medium w-24 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {alumnos.length === 0 ? (
              <tr>
                <td
                  colSpan={4 + periodos.length}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  No hay alumnos cargados o no has seleccionado un aula.
                </td>
              </tr>
            ) : (
              alumnos.map((alumno) => (
                <tr
                  key={alumno.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {alumno.apellidos}, {alumno.nombres}
                  </td>

                  {/* Columnas dinámicas de periodos */}
                  {periodos.map((p) => {
                    const esPeriodoEditable =
                      p.id?.toString() === periodoActivo?.toString();
                    const notaHistorica = historialNotas.find(
                      (h) =>
                        h.estudianteId === alumno.id &&
                        h.periodo?.toString() === p.id?.toString(),
                    );

                    return (
                      <td key={p.id} className="px-2 py-2 text-center">
                        {esPeriodoEditable ? (
                          <input
                            type="text"
                            maxLength={3}
                            placeholder={notaHistorica?.valor || "AD / 20"}
                            className="w-20 mx-auto border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-900 text-center font-bold text-slate-800 dark:text-slate-100 uppercase focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:font-normal placeholder:text-slate-400"
                            value={notasEditables[alumno.id]?.valor || ""}
                            onChange={(e) =>
                              onNotaChange(alumno.id, "valor", e.target.value)
                            }
                          />
                        ) : (
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {notaHistorica ? notaHistorica.valor : "-"}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Columna de Promedios */}
                  <td className="px-2 py-2 text-center bg-slate-100/30 dark:bg-slate-900/10 font-bold">
                    {obtenerPromedioHtml(alumno.id)}
                  </td>

                  {/* Observaciones del periodo editable */}
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      placeholder="Comentario opcional..."
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                      value={notasEditables[alumno.id]?.comentario || ""}
                      onChange={(e) =>
                        onNotaChange(alumno.id, "comentario", e.target.value)
                      }
                      disabled={!periodoActivo}
                    />
                  </td>

                  {/* Botón de guardar */}
                  <td className="px-6 py-2 text-center">
                    <button
                      onClick={() => onGuardar(alumno.id)}
                      className="inline-flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                      style={{ color: "var(--color-primary)" }}
                      disabled={!periodoActivo || !cursoId}
                      title="Guardar calificación"
                    >
                      <Save size={18} strokeWidth={2.5} />
                    </button>
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
