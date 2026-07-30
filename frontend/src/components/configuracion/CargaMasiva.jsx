import { useState } from "react";
import { importacionApi } from "../../api/importacionApi";
import { DropzoneExcel } from "./DropzoneExcel";
import { GuiaColumnas } from "./GuiaColumnas";
import { ResumenResultado } from "./ResumenResultado";
import { Download, Zap, Layers } from "lucide-react";
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

      // Ejecuta la generación local mediante ExcelJS
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

    // Confirmación visual con SweetAlert2 antes de procesar
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

      // Feedback visual del resultado final
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Carga Masiva de Datos
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selecciona el método de carga preferido para tu institución.
        </p>
      </div>

      {/* TABS DINÁMICOS */}
      <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
        <button
          onClick={() => {
            setModo("UNIFICADO");
            setResultado(null);
            setArchivo(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            modo === "UNIFICADO"
              ? "bg-white dark:bg-slate-800 shadow-sm font-semibold"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
          style={modo === "UNIFICADO" ? { color: "var(--color-primary)" } : {}}
        >
          <Zap className="w-4 h-4" /> Carga Rápida Unificada
        </button>
        <button
          onClick={() => {
            setModo("MODULAR");
            setResultado(null);
            setArchivo(null);
          }}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            modo === "MODULAR"
              ? "bg-white dark:bg-slate-800 shadow-sm font-semibold"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
          style={modo === "MODULAR" ? { color: "var(--color-primary)" } : {}}
        >
          <Layers className="w-4 h-4" /> Carga Por Pasos
        </button>
      </div>

      {modo === "UNIFICADO" ? (
        <div className="space-y-4 mb-6">
          <div
            className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border p-4 rounded-xl"
            style={{ borderColor: "var(--color-primary)" }}
          >
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Un solo archivo procesa estructura, docentes y alumnos en cascada.
            </span>
            <button
              onClick={() => handleDescargar("MAESTRO")}
              className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Download className="w-3.5 h-3.5" /> Plantilla Unificada
            </button>
          </div>
          <GuiaColumnas />
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl">
          <div className="flex gap-1">
            {["Estructura", "Docentes", "Estudiantes"].map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPasoModular(idx + 1);
                  setResultado(null);
                  setArchivo(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  pasoModular === idx + 1
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:opacity-70 px-2 py-1"
          >
            <Download className="w-3.5 h-3.5" /> Plantilla Paso {pasoModular}
          </button>
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
