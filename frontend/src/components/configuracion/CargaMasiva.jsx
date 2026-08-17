// src/components/configuracion/CargaMasiva.jsx
import { useState } from "react";
import { importacionApi } from "../../api/importacionApi";
import { DropzoneExcel } from "./DropzoneExcel";
import { GuiaColumnas } from "./GuiaColumnas";
import { ResumenResultado } from "./ResumenResultado";
import { Download, Zap, Layers, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { plantillaGenerators } from "../../utils/excelGenerator";
import Swal from "sweetalert2";

export const CargaMasiva = ({ colegioId = 1 }) => {
  const [modo, setModo] = useState("UNIFICADO");
  const [pasoModular, setPasoModular] = useState(1);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleDescargar = async (tipo) => {
    const toastId = toast.loading("Generando plantilla Excel...");

    try {
      const acciones = {
        MAESTRO: {
          fn: plantillaGenerators.descargarMaestro,
          name: "plantilla_carga_unificada.xlsx",
        },
        ESTRUCTURA: {
          fn: plantillaGenerators.descargarEstructura,
          name: "plantilla_paso1_estructura.xlsx",
        },
        DOCENTES: {
          fn: plantillaGenerators.descargarDocentes,
          name: "plantilla_paso2_docentes.xlsx",
        },
        ESTUDIANTES: {
          fn: plantillaGenerators.descargarEstudiantes,
          name: "plantilla_paso3_estudiantes.xlsx",
        },
      };

      const plantilla = acciones[tipo];

      if (!plantilla) {
        throw new Error("Tipo de plantilla no válido");
      }

      await plantilla.fn();

      toast.success(`Plantilla descargada: ${plantilla.name}`, { id: toastId });
    } catch (error) {
      console.error("Error al generar la plantilla local:", error);
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
      title: "¿Procesar archivo?",
      text: `Se importarán los datos de "${archivo.name}"`,
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
      let res;
      if (modo === "UNIFICADO") {
        res = await importacionApi.importarMaestro(archivo, colegioId);
      } else {
        const acciones = [
          importacionApi.importarEstructura,
          importacionApi.importarDocentes,
          importacionApi.importarEstudiantes,
        ];
        res = await acciones[pasoModular - 1](archivo, colegioId);
      }

      setResultado(res);
      toast.success("Procesamiento finalizado", { id: toastId });

      if (res.errores && res.errores.length > 0) {
        Swal.fire({
          title: "Proceso completado con observaciones",
          text: `Se procesaron filas pero hubieron ${res.registrosFallidos} errores. Revisa el detalle en pantalla.`,
          icon: "warning",
          confirmButtonColor: "var(--color-primary)",
        });
      } else {
        Swal.fire({
          title: "¡Importación Exitosa!",
          text: "Todos los registros se importaron correctamente.",
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 shadow-xs max-w-4xl space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
          Carga Masiva de Datos
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Selecciona el método de carga preferido para tu institución.
        </p>
      </div>

      {/* Banner Informativo */}
      {(modo === "UNIFICADO" || (modo === "MODULAR" && pasoModular === 3)) && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold mb-0.5">
              Recomendación antes de cargar estudiantes
            </p>
            <p className="leading-relaxed text-amber-700 dark:text-amber-300 text-xs">
              Para que el cronograma de matrícula y pensiones se genere
              automáticamente en el <strong>Módulo de Caja</strong>, te
              sugerimos haber configurado primero el año escolar en{" "}
              <strong>Tarifarios</strong>.
            </p>
          </div>
        </div>
      )}

      {/* TABS DINÁMICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl">
        <button
          onClick={() => {
            setModo("UNIFICADO");
            setResultado(null);
            setArchivo(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            modo === "UNIFICADO"
              ? "bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-slate-100"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
          style={modo === "UNIFICADO" ? { color: "var(--color-primary)" } : {}}
        >
          <Zap className="w-4 h-4 shrink-0" /> Carga Rápida Unificada
        </button>
        <button
          onClick={() => {
            setModo("MODULAR");
            setResultado(null);
            setArchivo(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            modo === "MODULAR"
              ? "bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-slate-100"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
          style={modo === "MODULAR" ? { color: "var(--color-primary)" } : {}}
        >
          <Layers className="w-4 h-4 shrink-0" /> Carga Por Pasos
        </button>
      </div>

      {modo === "UNIFICADO" ? (
        <div className="space-y-4">
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 border p-3.5 sm:p-4 rounded-xl"
            style={{ borderColor: "var(--color-primary)" }}
          >
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Un solo archivo procesa estructura, docentes, apoderados y alumnos
              en cascada.
            </span>
            <button
              onClick={() => handleDescargar("MAESTRO")}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-xl hover:opacity-90 transition-all shadow-xs shrink-0 active:scale-95"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Download className="w-3.5 h-3.5" /> Descargar Plantilla Unificada
            </button>
          </div>
          <GuiaColumnas />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
            <div className="grid grid-cols-3 gap-1 w-full sm:w-auto">
              {["Estructura", "Docentes", "Estudiantes"].map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPasoModular(idx + 1);
                    setResultado(null);
                    setArchivo(null);
                  }}
                  className={`px-2.5 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                    pasoModular === idx + 1
                      ? "text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                  style={
                    pasoModular === idx + 1
                      ? { backgroundColor: "var(--color-primary)" }
                      : {}
                  }
                >
                  Paso {idx + 1}: {step}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                handleDescargar(
                  ["ESTRUCTURA", "DOCENTES", "ESTUDIANTES"][pasoModular - 1],
                )
              }
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 sm:border-transparent"
            >
              <Download className="w-3.5 h-3.5" /> Descargar Plantilla Paso{" "}
              {pasoModular}
            </button>
          </div>
        </div>
      )}

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
