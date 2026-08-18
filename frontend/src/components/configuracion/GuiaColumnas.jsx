// src/components/configuracion/GuiaColumnas.jsx
export const GuiaColumnas = ({ pasoModular = 1 }) => {
  const columnasPorPaso = {
    1: [
      {
        label: "Nivel",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      },
      {
        label: "Grado",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      },
      {
        label: "Sección",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      },
      {
        label: "Curso",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      },
    ],
    2: [
      {
        label: "DNI",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      },
      {
        label: "Nombres",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      },
      {
        label: "Apellidos",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      },
      {
        label: "Email",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      },
      {
        label: "Teléfono",
        color:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      },
    ],
    3: [
      {
        label: "DNI Alumno",
        color:
          "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      },
      {
        label: "Nombres Alumno",
        color:
          "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      },
      {
        label: "Apellidos Alumno",
        color:
          "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      },
      {
        label: "Grado",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      },
      {
        label: "Sección",
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      },
      {
        label: "Fecha Nacimiento",
        color:
          "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      },
      {
        label: "Fecha Inscripción",
        color:
          "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      },
      {
        label: "DNI Apoderado",
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      },
      {
        label: "Nombres Apoderado",
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      },
      {
        label: "Apellidos Apoderado",
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      },
      {
        label: "Teléfono Apoderado",
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      },
    ],
  };

  const columnas = columnasPorPaso[pasoModular] || [];

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/50 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Columnas Requeridas en la Fila 1 (Paso {pasoModular})
        </p>
        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
          {columnas.length} columnas
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {columnas.map((col, idx) => (
          <span
            key={idx}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${col.color}`}
          >
            {col.label}
          </span>
        ))}
      </div>
    </div>
  );
};
