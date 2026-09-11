//src/app/pages/Docentes/Calificaciones/CalificacionesFilter.jsx
export default function CalificacionesFilter({
  gradoId,
  setGradoId,
  gradosDisponibles = [],
  seccionId,
  setSeccionId,
  seccionesDisponibles = [],
  cursoId,
  setCursoId,
  cursosDisponibles = [],
  periodoId,
  setPeriodoId,
  periodosDisponibles = [],
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* 1. Selector de Grado */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Grado
        </label>
        <select
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
          value={gradoId}
          onChange={(e) => setGradoId(e.target.value)}
        >
          <option value="">Selecciona grado...</option>
          {gradosDisponibles.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Selector de Sección */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Sección
        </label>
        <select
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50"
          value={seccionId}
          onChange={(e) => setSeccionId(e.target.value)}
          disabled={!gradoId}
        >
          <option value="">
            {gradoId ? "Selecciona sección..." : "Elige un grado"}
          </option>
          {seccionesDisponibles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Selector de Curso */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Curso
        </label>
        <select
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50"
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
          disabled={!seccionId}
        >
          <option value="">
            {seccionId ? "Selecciona curso..." : "Elige una sección"}
          </option>
          {cursosDisponibles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Selector de Periodo */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Periodo
        </label>
        <select
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
          value={periodoId}
          onChange={(e) => setPeriodoId(e.target.value)}
        >
          <option value="">Selecciona periodo...</option>
          {periodosDisponibles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
