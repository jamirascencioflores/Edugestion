import { Save, Edit } from "lucide-react";

export default function CalificacionesTable({
  alumnos,
  periodos,
  periodoActivo,
  cursoId,
  historialNotas,
  notasEditables,
  onNotaChange,
  onGuardar,
  onEditar,
  modoEdicion,
}) {
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
              <th className="px-6 py-4 font-medium min-w-50">
                Observaciones (Periodo Activo)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {alumnos.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + periodos.length}
                  className="px-6 py-8 text-center text-slate-400"
                >
                  No hay alumnos cargados o no has seleccionado un aula.
                </td>
              </tr>
            ) : (
              alumnos.map((alumno) => {
                // Buscamos la nota histórica del periodo activo para las observaciones
                const notaHistoricaActiva = historialNotas.find(
                  (h) =>
                    h.estudianteId === alumno.id &&
                    h.periodo?.toString() === periodoActivo?.toString(),
                );

                return (
                  <tr
                    key={alumno.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {alumno.apellidos}, {alumno.nombres}
                    </td>

                    {periodos.map((p) => {
                      const esPeriodoEditable =
                        p.id?.toString() === periodoActivo?.toString();
                      const notaHistorica = historialNotas.find(
                        (h) =>
                          h.estudianteId === alumno.id &&
                          h.periodo?.toString() === p.id?.toString(),
                      );

                      const valorInput =
                        notasEditables[alumno.id]?.valor !== undefined
                          ? notasEditables[alumno.id].valor
                          : notaHistorica?.valor || "";

                      const estaVacio = valorInput.trim() === "";

                      // LÓGICA DE BLOQUEO
                      const tieneNotaGuardada = notaHistorica !== undefined;
                      const mostrarInput =
                        esPeriodoEditable &&
                        (!tieneNotaGuardada || modoEdicion);

                      return (
                        <td key={p.id} className="px-2 py-2 text-center">
                          {mostrarInput ? (
                            <input
                              type="text"
                              maxLength={3}
                              placeholder={notaHistorica?.valor || "AD/20"}
                              className={`w-20 mx-auto border rounded-lg p-2 text-center font-bold uppercase focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:font-normal
                                ${
                                  estaVacio
                                    ? "border-red-400 bg-red-50 text-red-700 placeholder:text-red-300 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-400"
                                    : "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                }`}
                              value={valorInput}
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

                    <td className="px-2 py-2 text-center bg-slate-100/30 dark:bg-slate-900/10 font-bold">
                      {obtenerPromedioHtml(alumno.id)}
                    </td>

                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Comentario opcional..."
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                        value={
                          notasEditables[alumno.id]?.comentario !== undefined
                            ? notasEditables[alumno.id].comentario
                            : notaHistoricaActiva?.comentario || ""
                        }
                        onChange={(e) =>
                          onNotaChange(alumno.id, "comentario", e.target.value)
                        }
                        disabled={
                          !periodoActivo ||
                          (notaHistoricaActiva && !modoEdicion)
                        }
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Controles Generales */}
      {alumnos.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3">
          <button
            onClick={onEditar}
            disabled={!periodoActivo || modoEdicion} // <-- Añadir modoEdicion
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <Edit size={16} />
            Editar Notas
          </button>

          <button
            onClick={onGuardar}
            disabled={!periodoActivo || !cursoId}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save size={16} />
            Guardar Todo
          </button>
        </div>
      )}
    </div>
  );
}
