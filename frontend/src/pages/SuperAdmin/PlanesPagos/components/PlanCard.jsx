import { Check, Edit2, X } from "lucide-react";

export default function PlanCard({ plan, onEdit }) {
  const caracteristicas = [
    { label: "Portal de Padres", active: plan.permitePortalPadres },
    { label: "Notificaciones Automáticas", active: plan.permiteNotificaciones },
    { label: "Reportes y PDFs Avanzados", active: plan.permiteReportesPdf },
    { label: "Marca Blanca (Sin logos)", active: plan.permiteMarcaBlanca },
    { label: "Finanzas PRO (Morosidad)", active: plan.permiteFinanzasPro },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-700"
              style={{ color: "var(--color-primary)" }}
            >
              {plan.nombre}
            </span>
            <h3 className="text-3xl font-extrabold mt-3">
              S/ {plan.precioMensual}{" "}
              <span className="text-sm font-normal text-slate-400">/ mes</span>
            </h3>
          </div>
          <button
            onClick={() => onEdit(plan)}
            className="p-2 text-slate-400 transition-colors hover:opacity-80"
            title="Editar Plan"
          >
            <Edit2 size={18} />
          </button>
        </div>

        <div className="space-y-3 my-6 text-sm">
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <span className="text-slate-500">Límite de Alumnos:</span>
            <span className="font-semibold">
              {plan.limiteAlumnos >= 999999 ? "Ilimitados" : plan.limiteAlumnos}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Características incluidas:
            </p>
            {caracteristicas.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {feat.active ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <X size={16} className="text-slate-300 dark:text-slate-600" />
                )}
                <span
                  className={
                    feat.active
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-400 line-through"
                  }
                >
                  {feat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onEdit(plan)}
        className="w-full mt-4 py-2.5 text-white font-medium rounded-xl transition-all text-sm shadow-md"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Modificar Configuración
      </button>
    </div>
  );
}
