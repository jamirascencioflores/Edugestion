import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export const DropzoneExcel = ({ archivo, setArchivo, onSubmit, cargando }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div
        className="border-2 border-dashed bg-slate-50/50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl p-8 text-center transition-all cursor-pointer relative"
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
              className="w-12 h-12 mb-2 animate-bounce"
              style={{ color: "var(--color-primary)" }}
            />
          ) : (
            <UploadCloud
              className="w-12 h-12 mb-2"
              style={{ color: "var(--color-primary)" }}
            />
          )}
          <span className="text-slate-800 dark:text-slate-200 font-semibold text-base">
            {archivo ? archivo.name : "Selecciona o arrastra tu archivo Excel"}
          </span>
          <span className="text-slate-400 text-xs mt-1">
            Soporta formato .xlsx
          </span>
        </label>
      </div>

      {archivo && (
        <button
          type="submit"
          disabled={cargando}
          className="w-full text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {cargando ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando data...
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              Importar Información
            </>
          )}
        </button>
      )}
    </form>
  );
};
