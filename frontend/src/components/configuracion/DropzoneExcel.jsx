// src/components/configuracion/DropzoneExcel.jsx
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export const DropzoneExcel = ({ archivo, setArchivo, onSubmit, cargando }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <div
        className="border-2 border-dashed bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer relative"
        style={{ borderColor: "var(--color-primary)" }}
      >
        <input
          type="file"
          accept=".xlsx"
          id="excelInput"
          className="hidden"
          onChange={(e) => setArchivo(e.target.files[0])}
        />
        <label
          htmlFor="excelInput"
          className="cursor-pointer flex flex-col items-center"
        >
          {archivo ? (
            <CheckCircle2
              className="w-10 h-10 sm:w-12 sm:h-12 mb-2 animate-bounce"
              style={{ color: "var(--color-primary)" }}
            />
          ) : (
            <UploadCloud
              className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
              style={{ color: "var(--color-primary)" }}
            />
          )}
          <span className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base break-all px-2">
            {archivo ? archivo.name : "Selecciona o arrastra tu archivo Excel"}
          </span>
          <span className="text-slate-400 text-xs mt-1">
            Solo archivos en formato .xlsx
          </span>
        </label>
      </div>

      {archivo && (
        <button
          type="submit"
          disabled={cargando}
          className="w-full text-white py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {cargando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Procesando archivo...</span>
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              <span>Importar Información</span>
            </>
          )}
        </button>
      )}
    </form>
  );
};
