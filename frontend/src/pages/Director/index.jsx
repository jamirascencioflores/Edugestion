import { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  Wallet,
  AlertTriangle,
  UserPlus,
  CreditCard,
  Megaphone,
  FileText,
  Download,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";

export default function DashboardDirector() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const response = await api.get(
          "/academicos/dashboard/director/resumen",
        );
        if (isMounted) {
          setMetrics(response.data);
        }
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        toast.error("No se pudieron conectar las métricas del colegio.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Cargando datos en tiempo real de tu colegio...
        </p>
      </div>
    );
  }

  const data = metrics || {
    totalEstudiantes: 0,
    porcentajeCrecimientoEstudiantes: 0,
    seccionesActivas: 0,
    totalDocentes: 0,
    docentesSinAsignar: 0,
    recaudoMesActual: 0,
    porcentajeRecaudoMes: 0,
    porcentajeMorosidad: 0,
    alumnosMorosos: 0,
    recaudacionMensual: [],
    alertas: { contratosPorVencer: 0 },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. ENCABEZADO DE PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Panel del Director
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resumen operativo, académico y financiero en tiempo real.
          </p>
        </div>

        <button
          onClick={() => toast.success("Generando reporte ejecutivo en PDF...")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <Download size={16} /> Descargar Reporte General
        </button>
      </div>

      {/* 2. FILA DE TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Estudiantes (Real de BD) */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <GraduationCap size={22} />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
              <TrendingUp size={12} /> {data.porcentajeCrecimientoEstudiantes}%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Estudiantes
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {data.totalEstudiantes}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
            <Users size={14} className="text-slate-400" />{" "}
            {data.seccionesActivas} Secciones activas
          </p>
        </div>

        {/* KPI 2: Docentes (Real de BD) */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Users size={22} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              Activos
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Personal Docente
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {data.totalDocentes}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
            <CheckCircle2 size={14} className="text-emerald-500" />{" "}
            {data.docentesSinAsignar === 0
              ? "100% Asignados"
              : `${data.docentesSinAsignar} sin asignación`}
          </p>
        </div>

        {/* KPI 3: Recaudo del Mes */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <Wallet size={22} />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
              Actual
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recaudo del Mes
            </p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              S/{" "}
              {data.recaudoMesActual?.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Progreso</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {data.porcentajeRecaudoMes}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${data.porcentajeRecaudoMes}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4: Morosidad */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
              <AlertTriangle size={22} />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800">
              <TrendingDown size={12} /> {data.porcentajeMorosidad}%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Morosidad Actual
            </p>
            <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
              {data.porcentajeMorosidad}%
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
            <FileText size={14} className="text-slate-400" />{" "}
            {data.alumnosMorosos} Alumnos pendientes
          </p>
        </div>
      </div>

      {/* 3. SECCIÓN CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Estado de Recaudación 2026
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparativa de pensiones cobradas vs. pendientes por mes
              </p>
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="h-64 flex items-end justify-between gap-6 px-4 pt-6 border-b border-slate-100 dark:border-slate-700">
            {data.recaudacionMensual?.map((d) => (
              <div
                key={d.mes}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div className="w-full max-w-[48px] h-full flex flex-col justify-end bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden p-1 gap-1">
                  <div
                    className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm transition-all"
                    style={{ height: `${d.pendiente}%` }}
                    title={`Pendiente: ${d.pendiente}%`}
                  />
                  <div
                    className="w-full bg-purple-600 rounded-b-md transition-all"
                    style={{ height: `${d.recaudado}%` }}
                    title={`Recaudado: ${d.recaudado}%`}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {d.mes}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-600" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Recaudado
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Pendiente
              </span>
            </div>
          </div>
        </div>

        {/* Lado Derecho */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">
              Acciones Rápidas
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/estudiantes")}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all text-center space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UserPlus size={18} />
                </div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Nueva Matrícula
                </span>
              </button>

              <button
                onClick={() => navigate("/caja")}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all text-center space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <CreditCard size={18} />
                </div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Registrar Cobro
                </span>
              </button>

              <button
                onClick={() => navigate("/anuncios")}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all text-center space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Megaphone size={18} />
                </div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Nuevo Anuncio
                </span>
              </button>

              <button
                onClick={() => navigate("/tarifarios")}
                className="p-4 bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl border border-rose-100 dark:border-rose-900/40 transition-all text-center space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <span className="block text-xs font-bold text-rose-700 dark:text-rose-300">
                  Reporte Morosos
                </span>
              </button>
            </div>
          </div>

          {data.alertas?.contratosPorVencer > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 rounded-2xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <AlertTriangle size={18} className="text-amber-600" />
                <span>Atención Requerida</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                {data.alertas.contratosPorVencer} contrato(s) docente(s)
                próximo(s) a vencer este mes.
              </p>
              <button
                onClick={() => navigate("/docentes")}
                className="text-xs font-bold text-amber-800 dark:text-amber-300 underline hover:text-amber-900 transition-colors"
              >
                Revisar contratos →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
