import { Megaphone, AlertCircle, Calendar } from "lucide-react";

export default function KpiCardsAnuncios({ anuncios = [] }) {
  const total = anuncios.length;
  const altaPrioridad = anuncios.filter((a) => a.prioridad === "ALTA").length;
  const hoyStr = new Date().toISOString().split("T")[0];
  const publicadosHoy = anuncios.filter(
    (a) => a.fechaPublicacion && a.fechaPublicacion.startsWith(hoyStr),
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Comunicados
          </p>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
            {total}
          </p>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl">
          <Megaphone size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Urgentes / Alta Prioridad
          </p>
          <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {altaPrioridad}
          </p>
        </div>
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl">
          <AlertCircle size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Publicados Hoy
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {publicadosHoy}
          </p>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
          <Calendar size={24} />
        </div>
      </div>
    </div>
  );
}
