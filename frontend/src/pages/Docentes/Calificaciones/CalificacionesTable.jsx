import { useRef, useCallback } from "react";

// Mapa de conversión y equivalencias CNEB
const ESCALA_LITERAL = {
  AD: { valor: 4, label: "Logro Destacado", color: "emerald" },
  A: { valor: 3, label: "Logro Esperado", color: "emerald" },
  B: { valor: 2, label: "En Proceso", color: "amber" },
  C: { valor: 1, label: "En Inicio", color: "rose" },
};

const INVERSA_LITERAL = { 4: "AD", 3: "A", 2: "B", 1: "C" };

export default function CalificacionesTable({
  alumnos = [],
  periodos = [],
  periodoActivo,
  esPeriodoEditable,
  historialNotas = [],
  notasEditables = {},
  onNotaChange,
}) {
  const inputsRef = useRef([]);

  // Validación y formato de estilos según escala (literal o vigesimal)
  const getBadgeNota = (notaRaw) => {
    if (!notaRaw || notaRaw === "—")
      return { texto: "—", clase: "text-slate-300 dark:text-slate-600" };

    const nota = String(notaRaw).trim().toUpperCase();

    // Caso 1: Literal (AD, A, B, C)
    if (ESCALA_LITERAL[nota]) {
      if (nota === "AD" || nota === "A") {
        return {
          texto: nota,
          clase:
            "border-emerald-300 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800",
        };
      }
      if (nota === "B") {
        return {
          texto: nota,
          clase:
            "border-amber-300 bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:border-amber-800",
        };
      }
      return {
        texto: nota,
        clase:
          "border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-800",
      };
    }

    // Caso 2: Numérico Vigesimal (0 - 20)
    const num = Number(nota);
    if (!isNaN(num)) {
      const aprobado = num >= 11;
      return {
        texto: nota,
        clase: aprobado
          ? "border-emerald-300 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800"
          : "border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-800",
      };
    }

    return {
      texto: nota,
      clase:
        "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200",
    };
  };

  // Cálculo inteligente de promedio (detecta si el alumno tiene notas literales o numéricas)
  const calcularPromedio = useCallback(
    (alumnoId) => {
      const notas = periodos
        .map((p) => {
          const editada =
            String(p.id) === String(periodoActivo)
              ? notasEditables[alumnoId]?.valor
              : undefined;

          if (editada !== undefined && editada !== "")
            return editada.trim().toUpperCase();

          const guardada = historialNotas.find(
            (h) =>
              h.estudianteId === alumnoId && String(h.periodo) === String(p.id),
          );
          return guardada ? guardada.valor?.trim().toUpperCase() : null;
        })
        .filter(Boolean);

      if (notas.length === 0)
        return { texto: "-", tipo: "none", esAprobado: null };

      // Si todas son numéricas: promedio decimal tradicional
      const todasNumericas = notas.every((n) => !isNaN(n));
      if (todasNumericas) {
        const suma = notas.reduce((acc, v) => acc + Number(v), 0);
        const prom = (suma / notas.length).toFixed(1);
        return { texto: prom, tipo: "num", esAprobado: Number(prom) >= 11 };
      }

      // Si contiene letras (AD, A, B, C): escala cualitativa MINEDU
      const sumaPonderada = notas.reduce((acc, v) => {
        if (ESCALA_LITERAL[v]) return acc + ESCALA_LITERAL[v].valor;
        const num = Number(v);
        if (!isNaN(num)) {
          if (num >= 18) return acc + 4; // AD
          if (num >= 14) return acc + 3; // A
          if (num >= 11) return acc + 2; // B
          return acc + 1; // C
        }
        return acc + 2;
      }, 0);

      const nivelRedondeado = Math.min(
        4,
        Math.max(1, Math.round(sumaPonderada / notas.length)),
      );
      const letraFinal = INVERSA_LITERAL[nivelRedondeado] || "B";

      return {
        texto: letraFinal,
        tipo: "literal",
        esAprobado: letraFinal !== "C",
        esB: letraFinal === "B",
      };
    },
    [periodos, periodoActivo, notasEditables, historialNotas],
  );

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      if (inputsRef.current[index + 1]) {
        inputsRef.current[index + 1].focus();
        inputsRef.current[index + 1].select();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputsRef.current[index - 1]) {
        inputsRef.current[index - 1].focus();
        inputsRef.current[index - 1].select();
      }
    }
  };

  const periodoActualObj = periodos.find(
    (p) => String(p.id) === String(periodoActivo),
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header Info con Leyenda Adaptada */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Listado Oficial 2026
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
            {alumnos.length} Alumnos
          </span>
        </div>

        {/* Leyenda Híbrida Literal / Numérica */}
        <div className="flex items-center flex-wrap gap-3 text-[11px]">
          <span className="hidden sm:inline text-slate-400">
            Usa{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono">
              Enter
            </kbd>{" "}
            para avanzar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> AD / A
            (Aprobado)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> B (En
            Proceso)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> C (En Inicio /
            &lt;11)
          </span>
        </div>
      </div>

      {/* 1. VISTA MÓVIL (< 768px): CARDS */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-700/60">
        {alumnos.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Selecciona un aula y curso para ver los alumnos.
          </div>
        ) : (
          alumnos.map((alumno, index) => {
            const iniciales = `${alumno.apellidos?.[0] || ""}${alumno.nombres?.[0] || ""}`;
            const notaGuardada = historialNotas.find(
              (h) =>
                h.estudianteId === alumno.id &&
                String(h.periodo) === String(periodoActivo),
            );

            const valorInput =
              notasEditables[alumno.id]?.valor !== undefined
                ? notasEditables[alumno.id].valor
                : notaGuardada?.valor || "";

            const badge = getBadgeNota(valorInput);
            const promedio = calcularPromedio(alumno.id);

            return (
              <div key={alumno.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center">
                      {iniciales}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {alumno.apellidos}, {alumno.nombres}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        N° {String(index + 1).padStart(2, "0")} • DNI:{" "}
                        {alumno.dni || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Promedio */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] block text-slate-400 font-medium">
                      Logro
                    </span>
                    <span
                      className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-md ${
                        promedio.esAprobado === true && !promedio.esB
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : promedio.esB
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            : promedio.esAprobado === false
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-500"
                      }`}
                    >
                      {promedio.texto}
                    </span>
                  </div>
                </div>

                {/* Input Calificación */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                      {periodoActualObj?.nombre?.replace("Año Escolar ", "") ||
                        "Bimestre Activo"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {esPeriodoEditable
                        ? "Ingresa AD, A, B, C o 0-20"
                        : "Periodo cerrado"}
                    </span>
                  </div>

                  {esPeriodoEditable ? (
                    <input
                      type="text"
                      maxLength={3}
                      value={valorInput}
                      onChange={(e) =>
                        onNotaChange(
                          alumno.id,
                          "valor",
                          e.target.value.toUpperCase(),
                        )
                      }
                      className={`w-16 h-11 text-center font-black rounded-xl border text-base outline-none shadow-sm transition-all uppercase ${badge.clase}`}
                      placeholder="—"
                    />
                  ) : (
                    <span className="w-16 h-11 flex items-center justify-center font-black text-sm bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                      {notaGuardada?.valor || "—"}
                    </span>
                  )}
                </div>

                {/* Comentario */}
                <input
                  type="text"
                  placeholder="Añadir comentario pedagógico..."
                  disabled={!esPeriodoEditable}
                  value={
                    notasEditables[alumno.id]?.comentario !== undefined
                      ? notasEditables[alumno.id].comentario
                      : notaGuardada?.comentario || ""
                  }
                  onChange={(e) =>
                    onNotaChange(alumno.id, "comentario", e.target.value)
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-40"
                />
              </div>
            );
          })
        )}
      </div>

      {/* 2. VISTA ESCRITORIO (>= 768px): TABLA COMPLETA */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 w-12 text-center">N°</th>
              <th className="px-6 py-4 min-w-[220px]">Estudiante</th>

              {periodos.map((p) => {
                const esActivo = String(p.id) === String(periodoActivo);
                return (
                  <th
                    key={p.id}
                    className={`px-4 py-4 text-center w-28 ${
                      esActivo
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/20"
                        : ""
                    }`}
                  >
                    <div>{p.nombre?.replace("Año Escolar ", "")}</div>
                    {esActivo && (
                      <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 lowercase">
                        (en curso)
                      </span>
                    )}
                  </th>
                );
              })}

              <th className="px-4 py-4 text-center w-24 bg-slate-100/50 dark:bg-slate-900/30">
                Logro Final
              </th>
              <th className="px-6 py-4 min-w-[240px]">
                Conclusiones Descriptivas
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {alumnos.map((alumno, index) => {
              const iniciales = `${alumno.apellidos?.[0] || ""}${alumno.nombres?.[0] || ""}`;
              const notaHistoricaActiva = historialNotas.find(
                (h) =>
                  h.estudianteId === alumno.id &&
                  String(h.periodo) === String(periodoActivo),
              );
              const promedio = calcularPromedio(alumno.id);

              return (
                <tr
                  key={alumno.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-4 text-center text-xs font-mono text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center">
                        {iniciales}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">
                          {alumno.apellidos}, {alumno.nombres}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          DNI: {alumno.dni || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {periodos.map((p) => {
                    const esEditable =
                      String(p.id) === String(periodoActivo) &&
                      esPeriodoEditable;
                    const notaGuardada = historialNotas.find(
                      (h) =>
                        h.estudianteId === alumno.id &&
                        String(h.periodo) === String(p.id),
                    );

                    const valorInput =
                      notasEditables[alumno.id]?.valor !== undefined
                        ? notasEditables[alumno.id].valor
                        : notaGuardada?.valor || "";

                    const badge = getBadgeNota(valorInput);

                    return (
                      <td key={p.id} className="px-3 py-3 text-center">
                        {esEditable ? (
                          <input
                            ref={(el) => (inputsRef.current[index] = el)}
                            type="text"
                            maxLength={3}
                            value={valorInput}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onChange={(e) =>
                              onNotaChange(
                                alumno.id,
                                "valor",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className={`w-16 h-10 mx-auto text-center font-black rounded-xl border text-sm outline-none transition-all uppercase ${badge.clase}`}
                            placeholder="—"
                          />
                        ) : (
                          <span className={`font-black text-sm ${badge.clase}`}>
                            {notaGuardada?.valor || "—"}
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Logro Final / Promedio */}
                  <td className="px-4 py-4 text-center bg-slate-50/50 dark:bg-slate-900/20">
                    <span
                      className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                        promedio.esAprobado === true && !promedio.esB
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : promedio.esB
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            : promedio.esAprobado === false
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                              : "text-slate-400"
                      }`}
                    >
                      {promedio.texto}
                    </span>
                  </td>

                  {/* Conclusiones Descriptivas */}
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      placeholder="Conclusión descriptiva de logro..."
                      disabled={!esPeriodoEditable}
                      value={
                        notasEditables[alumno.id]?.comentario !== undefined
                          ? notasEditables[alumno.id].comentario
                          : notaHistoricaActiva?.comentario || ""
                      }
                      onChange={(e) =>
                        onNotaChange(alumno.id, "comentario", e.target.value)
                      }
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-40"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {alumnos.length > 0 && (
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Mostrando {alumnos.length} estudiantes asignados</span>
          <span className="text-slate-400 text-[11px]">
            Escala evaluativa CNEB (AD, A, B, C) o escala vigesimal secundaria
          </span>
        </div>
      )}
    </div>
  );
}
