import { useState, useEffect } from "react";
import { Activity, Server, Users, Loader2 } from "lucide-react";
import api from "@/api/axiosConfig"; // Ajusta la ruta según tu proyecto
import { toast } from "sonner";

// COMPONENTE SECUNDARIO: Tarjetas KPI
function KpiCards({ data }) {
  const kpis = [
    {
      label: "Total Colegios",
      value: data.totalColegios || 0,
      trend: "Registrados en plataforma",
    },
    {
      label: "Colegios Activos",
      value: data.colegiosActivos || 0,
      trend: `${data.colegiosInactivos || 0} inactivos`,
      negative: data.colegiosInactivos > 0,
    },
    {
      label: "Ingresos Estimados (MRR)",
      value: `S/ ${data.ingresosMensualesEstimados?.toLocaleString("es-PE") || 0}`,
      trend: "Facturación mensual proyectada",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
            className={`text-xs font-semibold ${kpi.negative ? "text-orange-500" : "text-emerald-500"}`}
          >
            {kpi.trend}
          </p>
        </div>
      ))}
    </div>
  );
}

// COMPONENTE PRINCIPAL
export default function DashboardSA() {
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const response = await api.get("/auth/superadmin/dashboard/kpis");
        setKpis(response.data);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
        toast.error("Error al cargar las métricas globales");
      } finally {
        setLoading(false);
      }
    };
    fetchKpis();
  }, []);

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Dashboard General
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Vista global de la plataforma EduGestión.
        </p>
      </div>

      {/* MÉTRICAS DE SISTEMA (Fijas por ahora) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Estado Servidor
            </p>
            <h3 className="text-xl font-bold text-green-500">Óptimo</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tráfico de Red</p>
            <h3 className="text-xl font-bold">Normal</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">
              Cuentas Totales
            </p>
            <h3 className="text-xl font-bold">+15,000</h3>
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE NEGOCIO (Dinámicas) */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <KpiCards data={kpis} />
      )}
    </div>
  );
}
