export const GuiaColumnas = () => {
  const columnas = [
    { label: "Grado", cat: "Estructura" },
    { label: "Sección", cat: "Estructura" },
    { label: "Curso", cat: "Estructura" },
    { label: "DNI Docente", cat: "Docente" },
    { label: "Nombres Docente", cat: "Docente" },
    { label: "Apellidos Docente", cat: "Docente" },
    { label: "Email Docente", cat: "Docente" },
    { label: "DNI Alumno", cat: "Estudiante" },
    { label: "Nombres Alumno", cat: "Estudiante" },
    { label: "Apellidos Alumno", cat: "Estudiante" },
  ];

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        Columnas Requeridas en la Fila 1
      </p>
      <div className="flex flex-wrap gap-1.5">
        {columnas.map((col, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
          >
            {col.label}
          </span>
        ))}
      </div>
    </div>
  );
};
