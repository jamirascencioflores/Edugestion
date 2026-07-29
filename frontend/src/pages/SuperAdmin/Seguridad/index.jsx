import { useState, useEffect, useMemo } from "react";
import { ShieldCheck, Loader2, Activity, ShieldAlert } from "lucide-react";
import api from "@/api/axiosConfig";
import { toast } from "sonner";
import AuditoriaFiltros from "./components/AuditoriaFiltros";
import AuditoriaTabla from "./components/AuditoriaTabla";

export default function Seguridad() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroAccion, setFiltroAccion] = useState("TODOS");
  const [filtroEntidad, setFiltroEntidad] = useState("TODAS");

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        // Corrección de la ruta sin /api duplicado
        const res = await api.get("/auth/superadmin/auditoria");
        if (isMounted) setLogs(res.data);
      } catch (error) {
        console.error("Error al obtener auditoría:", error);
        if (isMounted) toast.error("Error al obtener los logs de seguridad");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extraer entidades únicas dinámicamente
  const entidadesDisponibles = useMemo(() => {
    const set = new Set(logs.map((l) => l.entidad).filter(Boolean));
    return Array.from(set);
  }, [logs]);

  // Filtrado reactivo en memoria
  const logsFiltrados = useMemo(() => {
    return logs.filter((log) => {
      const matchBusqueda =
        !busqueda ||
        log.usuarioEmail?.toLowerCase().includes(busqueda.toLowerCase()) ||
        log.ipOrigen?.includes(busqueda) ||
        log.detalle?.toLowerCase().includes(busqueda.toLowerCase());

      const matchAccion =
        filtroAccion === "TODOS" || log.accion?.toUpperCase() === filtroAccion;

      const matchEntidad =
        filtroEntidad === "TODAS" || log.entidad === filtroEntidad;

      return matchBusqueda && matchAccion && matchEntidad;
    });
  }, [logs, busqueda, filtroAccion, filtroEntidad]);

  const handleResetFiltros = () => {
    setBusqueda("");
    setFiltroAccion("TODOS");
    setFiltroEntidad("TODAS");
  };

  return (
    <div className="space-y-6">
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck style={{ color: "var(--color-primary)" }} size={30} />
            Seguridad y Auditoría
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Monitoreo en tiempo real de operaciones críticas y traza de
            auditoría del sistema.
          </p>
        </div>
      </div>

      {/* TARJETAS RESUMEN DE ACTIVIDAD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Total de Eventos
            </p>
            <h3 className="text-2xl font-extrabold mt-0.5">{logs.length}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Protección Perimetral
            </p>
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              Activa
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Fuerza Bruta / Rate Limit
            </p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              5 Intentos máx.
            </h3>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <AuditoriaFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroAccion={filtroAccion}
        setFiltroAccion={setFiltroAccion}
        filtroEntidad={filtroEntidad}
        setFiltroEntidad={setFiltroEntidad}
        entidadesDisponibles={entidadesDisponibles}
        onReset={handleResetFiltros}
      />

      {/* TABLA DE AUDITORÍA */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-slate-400" size={36} />
        </div>
      ) : (
        <AuditoriaTabla logs={logsFiltrados} />
      )}
    </div>
  );
}
