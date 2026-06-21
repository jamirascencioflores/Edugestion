export default function KpiCards() {
  const kpis = [
    { label: "Total Colegios", value: "142", trend: "+4.2% vs mes pasado" },
    {
      label: "Usuarios Activos",
      value: "12,840",
      trend: "+12.8% vs mes pasado",
    },
    {
      label: "Ingresos Mensuales",
      value: "$45,210",
      trend: "-1.4% vs mes pasado",
      negative: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            {kpi.label}
          </p>
          <h3 className="text-3xl font-extrabold mb-2">{kpi.value}</h3>
          <p
            className={`text-xs font-semibold ${kpi.negative ? "text-red-500" : "text-emerald-500"}`}
          >
            {kpi.trend}
          </p>
        </div>
      ))}
    </div>
  );
}
