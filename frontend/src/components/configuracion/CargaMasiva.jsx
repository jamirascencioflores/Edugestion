// src/components/configuracion/CargaMasiva.jsx
import { useState } from "react";
import { importacionApi } from "../../api/importacionApi";
import { DropzoneExcel } from "./DropzoneExcel";
import { GuiaColumnas } from "./GuiaColumnas";
import { ResumenResultado } from "./ResumenResultado";
import {
  Download,
  AlertCircle,
  Layers,
  GraduationCap,
  Users,  
} from "lucide-react";
import { toast } from "sonner";
import { plantillaGenerators } from "../../utils/excelGenerator";
import Swal from "sweetalert2";

export const CargaMasiva = ({ colegioId = 1 }) => {
  const [pasoModular, setPasoModular] = useState(1);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const pasosConfig = [
    {
      id: 1,
      titulo: "Estructura y Cursos",
      descripcion: "Niveles, Grados, Secciones y Asignaturas",
      icono: Layers,
      descargaFn: plantillaGenerators.descargarEstructura,
      nombreArchivo: "plantilla_paso1_estructura.xlsx",
    },
    {
      id: 2,
      titulo: "Plana Docente",
      descripcion: "Profesores, correos y teléfonos institucionales",
      icono: GraduationCap,
      descargaFn: plantillaGenerators.descargarDocentes,
      nombreArchivo: "plantilla_paso2_docentes.xlsx",
    },
    {
      id: 3,
      titulo: "Estudiantes y Apoderados",
      descripcion: "Nómina de alumnos, matrícula y contactos de apoderados",
      icono: Users,
      descargaFn: plantillaGenerators.descargarEstudiantes,
      nombreArchivo: "plantilla_paso3_estudiantes.xlsx",
    },
  ];

  const pasoActual = pasosConfig[pasoModular - 1];

  const handleDescargar = async () => {
    const toastId = toast.loading("Generando plantilla Excel...");
    try {
      await pasoActual.descargaFn();
      toast.success(`Plantilla descargada: ${pasoActual.nombreArchivo}`, {
        id: toastId,
      });
    } catch (error) {
      console.error("Error al generar la plantilla:", error);
      toast.error("Ocurrió un error al generar el archivo Excel.", {
        id: toastId,
      });
    }
  };

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!archivo) {
      toast.warning("Por favor, selecciona un archivo Excel primero.");
      return;
    }

    const confirm = await Swal.fire({
      title: `¿Procesar Paso ${pasoModular}: ${pasoActual.titulo}?`,
      text: `Se importarán los datos del archivo "${archivo.name}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, importar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    setCargando(true);
    setResultado(null);
    const toastId = toast.loading(
      "Procesando archivo... esto puede tardar un momento.",
    );

    try {
      const acciones = [
        importacionApi.importarEstructura,
        importacionApi.importarDocentes,
        importacionApi.importarEstudiantes,
      ];

      const res = await acciones[pasoModular - 1](archivo, colegioId);
      setResultado(res);
      toast.success("Procesamiento finalizado", { id: toastId });

      if (res.errores && res.errores.length > 0) {
        Swal.fire({
          title: "Proceso completado con observaciones",
          text: `Se procesaron registros pero hubieron ${res.registrosFallidos} errores. Revisa el detalle en pantalla.`,
          icon: "warning",
          confirmButtonColor: "var(--color-primary)",
        });
      } else {
        Swal.fire({
          title: "¡Importación Exitosa!",
          text: `Los registros del Paso ${pasoModular} se importaron correctamente.`,
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);

      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Error al procesar el archivo Excel";

      Swal.fire({
        title: "Error en la importación",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-xs max-w-4xl space-y-6">
      {/* Encabezado */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
          Carga Masiva de Datos
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Sigue el flujo de 3 pasos para configurar la información del colegio
          de forma ordenada.
        </p>
      </div>

      {/* Selector de Pasos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {pasosConfig.map((paso) => {
          const Icono = paso.icono;
          const activo = pasoModular === paso.id;
          return (
            <button
              key={paso.id}
              onClick={() => {
                setPasoModular(paso.id);
                setResultado(null);
                setArchivo(null);
              }}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                activo
                  ? "bg-slate-50 dark:bg-slate-900/80 border-slate-300 dark:border-slate-600 shadow-xs ring-1 ring-slate-400/20"
                  : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  activo
                    ? "text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
                style={
                  activo ? { backgroundColor: "var(--color-primary)" } : {}
                }
              >
                <Icono className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Paso {paso.id}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {paso.titulo}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Banner Informativo Paso 3 */}
      {pasoModular === 3 && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold mb-0.5">
              Recomendación antes de cargar estudiantes
            </p>
            <p className="leading-relaxed text-amber-700 dark:text-amber-300 text-xs">
              Para que el cronograma de matrícula y pensiones se genere
              automáticamente en el <strong>Módulo de Caja</strong>, asegúrate
              de haber configurado el año escolar en <strong>Tarifarios</strong>
              .
            </p>
          </div>
        </div>
      )}

      {/* Descarga de plantilla y guía */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Plantilla para {pasoActual.titulo}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {pasoActual.descripcion}
            </p>
          </div>
          <button
            onClick={handleDescargar}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl hover:opacity-90 transition-all shadow-xs shrink-0 active:scale-95"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Download className="w-3.5 h-3.5" /> Descargar Plantilla Paso{" "}
            {pasoModular}
          </button>
        </div>

        <GuiaColumnas pasoModular={pasoModular} />
      </div>

      {/* Dropzone y Resultado */}
      <DropzoneExcel
        archivo={archivo}
        setArchivo={setArchivo}
        onSubmit={handleSubir}
        cargando={cargando}
      />
      <ResumenResultado resultado={resultado} />
    </div>
  );
};
