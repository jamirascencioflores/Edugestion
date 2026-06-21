import { Users, CheckCircle, GraduationCap } from "lucide-react";

export default function KpiCards({ docentes }) {
  const activos = docentes.filter((d) => d.estado).length;
  //const inactivos = docentes.length - activos;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Total Docentes</p>
          <p className="text-2xl font-bold">{docentes.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Activos</p>
          <p className="text-2xl font-bold">{activos}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <GraduationCap size={24} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">Especialidades</p>
          <p className="text-2xl font-bold">
            {new Set(docentes.map((d) => d.especialidad)).size}
          </p>
        </div>
      </div>
    </div>
  );
}
