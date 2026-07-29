import { Globe, Lock, Save, Loader2 } from "lucide-react";

export default function ParametrosForm({
  config,
  setConfig,
  onSubmit,
  saving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6"
    >
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-3">
        Parámetros de Operación
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <Globe size={14} /> Dominio Base del SaaS
          </label>
          <input
            type="text"
            required
            value={config.dominioBase}
            onChange={(e) =>
              setConfig({ ...config, dominioBase: e.target.value })
            }
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Ej. colegio.<b>{config.dominioBase || "edugestion.io"}</b>
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 flex items-center gap-1.5">
            <Lock size={14} /> Intentos Máximos de Login (Fuerza Bruta)
          </label>
          <input
            type="number"
            min="3"
            max="10"
            required
            value={config.maxIntentosLogin}
            onChange={(e) =>
              setConfig({
                ...config,
                maxIntentosLogin: parseInt(e.target.value) || 5,
              })
            }
            className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Número de fallos consecutivos antes de bloquear temporalmente.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
          Mensaje Público de Mantenimiento
        </label>
        <textarea
          rows={3}
          value={config.mensajeMantenimiento}
          onChange={(e) =>
            setConfig({ ...config, mensajeMantenimiento: e.target.value })
          }
          className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none"
          placeholder="Mensaje que verán los usuarios durante el mantenimiento..."
        ></textarea>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {saving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Guardar Configuración
        </button>
      </div>
    </form>
  );
}
