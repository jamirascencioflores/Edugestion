// src/pages/Director/ReporteMorosos/index.jsx
import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axiosConfig";
import { generarExcelMorosidad } from "../../../utils/exportarMorososExcel";
import FeatureGuard from "../../../components/FeatureGuard";

import KpiCardsMorosidad from "./KpiCardsMorosidad";
import FiltrosMorosidad from "./FiltrosMorosidad";
import TablaMorosos from "./TablaMorosos";

export default function ReporteMorososIndex() {
  const [morosos, setMorosos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("TODOS");

  useEffect(() => {
    const fetchMorosos = async () => {
      try {
        setLoading(true);
        const [resFinanzas, resEstudiantes, resSecciones, resGrados] =
          await Promise.all([
            api.get("/finanzas/dashboard/morosos/detalle"),
            api.get("/academicos/estudiantes"),
            api.get("/academicos/secciones"),
            api.get("/academicos/grados"),
          ]);

        const listaDeudas = resFinanzas.data || [];
        const estudiantes =
          resEstudiantes.data?.content || resEstudiantes.data || [];
        const secciones = resSecciones.data || [];
        const grados = resGrados.data || [];

        const mapaEstudiantes = Object.fromEntries(
          estudiantes.map((e) => [e.id, e]),
        );
        const mapaSecciones = Object.fromEntries(
          secciones.map((s) => [s.id, s]),
        );
        const mapaGrados = Object.fromEntries(grados.map((g) => [g.id, g]));

        const morososEnriquecidos = listaDeudas.map((deuda) => {
          const alumno = mapaEstudiantes[deuda.estudianteId];
          let ubicacionTexto = "Sin asignar";

          if (alumno?.seccionId) {
            const seccion = mapaSecciones[alumno.seccionId];
            if (seccion) {
              const gradoId = seccion.gradoId || seccion.grado?.id;
              const grado = mapaGrados[gradoId];
              ubicacionTexto = grado
                ? `${grado.nombre} - "${seccion.nombre}"`
                : `Sección ${seccion.nombre}`;
            }
          }

          return {
            ...deuda,
            nombreEstudiante: alumno
              ? `${alumno.nombres} ${alumno.apellidos}`
              : `Estudiante #${deuda.estudianteId}`,
            dni: alumno?.dni || "Sin DNI",
            gradoSeccion: ubicacionTexto,
            nombreApoderado: alumno?.nombreApoderado || "",
            telefonoApoderado: alumno?.telefonoApoderado || "",
          };
        });

        setMorosos(morososEnriquecidos);
      } catch (error) {
        console.error("Error al enriquecer reporte de morosos:", error);
        toast.error("Error al cargar los datos del reporte de morosidad.");
      } finally {
        setLoading(false);
      }
    };

    fetchMorosos();
  }, []);

  const opcionesGrados = useMemo(() => {
    return Array.from(new Set(morosos.map((m) => m.gradoSeccion))).filter(
      (g) => g !== "Sin asignar",
    );
  }, [morosos]);

  const morososFiltrados = useMemo(() => {
    return morosos.filter((m) => {
      const coincideTexto =
        m.nombreEstudiante.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.dni.includes(searchQuery) ||
        m.nombreApoderado.toLowerCase().includes(searchQuery.toLowerCase());
      const coincideGrado =
        filtroGrado === "TODOS" || m.gradoSeccion === filtroGrado;
      return coincideTexto && coincideGrado;
    });
  }, [morosos, searchQuery, filtroGrado]);

  const totalDeudaGlobal = useMemo(() => {
    return morososFiltrados.reduce(
      (acc, m) => acc + (m.montoTotalDeuda || 0),
      0,
    );
  }, [morososFiltrados]);

  const handleDescargarExcel = async () => {
    try {
      setExportando(true);
      await generarExcelMorosidad(morososFiltrados);
      toast.success("Excel generado con éxito con pestañas por aula.");
    } catch (err) {
      toast.error(err.message || "Error al generar el archivo Excel.");
    } finally {
      setExportando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Generando reporte de morosidad...
        </p>
      </div>
    );
  }

  return (
    <FeatureGuard feature="permiteFinanzasPro">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header Responsivo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={24} />
              <span>Control de Morosidad</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Gestión de cuentas por cobrar y recordatorios de pago.
            </p>
          </div>

          <button
            onClick={handleDescargarExcel}
            disabled={exportando || morososFiltrados.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span>Exportar Excel (Por Aulas)</span>
          </button>
        </div>

        <KpiCardsMorosidad
          morosos={morososFiltrados}
          totalMorosos={morososFiltrados.length}
          totalDeudaGlobal={totalDeudaGlobal}
        />

        <FiltrosMorosidad
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filtroGrado={filtroGrado}
          setFiltroGrado={setFiltroGrado}
          opcionesGrados={opcionesGrados}
        />

        <TablaMorosos morosos={morososFiltrados} />
      </div>
    </FeatureGuard>
  );
}
