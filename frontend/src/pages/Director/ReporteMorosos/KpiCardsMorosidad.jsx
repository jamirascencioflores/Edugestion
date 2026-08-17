// src/pages/Director/ReporteMorosos/KpiCardsMorosidad.jsx
import { AlertTriangle, CreditCard, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function KpiCardsMorosidad({
  morosos = [],
  totalMorosos = 0,
  totalDeudaGlobal = 0,
}) {
  const notificarMasivoWhatsApp = async () => {
    if (!morosos || morosos.length === 0) {
      toast.error("No hay estudiantes morosos en la lista actual.");
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Enviar avisos de cobranza?",
      html: `Se abrirán las conversaciones de WhatsApp para <b>${morosos.length}</b> estudiante(s) con deudas pendientes.<br/><br/><span style="font-size: 0.85em; color: #64748b;">(Si el navegador bloquea las pestañas, permite las ventanas emergentes).</span>`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, notificar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-semibold px-4 py-2",
        cancelButton: "rounded-xl font-semibold px-4 py-2",
      },
    });

    if (confirmacion.isConfirmed) {
      toast.info("Iniciando envío de avisos...");

      morosos.forEach((item, index) => {
        setTimeout(() => {
          // Obtener teléfono o fallback
          let rawTelefono =
            item.telefonoApoderado || item.telefono || "51999999999";
          let telefono = String(rawTelefono).replace(/\D/g, "");

          if (telefono.length === 9 && !telefono.startsWith("51")) {
            telefono = `51${telefono}`;
          }

          const apoderado = item.nombreApoderado || "Estimado(a) Apoderado(a)";
          const monto = Number(item.montoTotalDeuda || 0).toFixed(2);
          const meses = item.mesesAtrasados || 1;

          const mensaje = encodeURIComponent(
            `Hola ${apoderado}, le saludamos de la institución educativa. Le recordamos amablemente que el estudiante ${item.nombreEstudiante} registra ${meses} mes(es) de pensión pendiente por un total de S/ ${monto}. Por favor, acérquese a caja para regularizar el estado de cuenta. ¡Gracias!`,
          );

          window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
        }, index * 900);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Morosos */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Alumnos Morosos
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {totalMorosos}
          </p>
        </div>
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0">
          <AlertTriangle size={24} />
        </div>
      </div>

      {/* Monto por Cobrar */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Monto Por Cobrar
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 font-mono">
            S/{" "}
            {Number(totalDeudaGlobal).toLocaleString("es-PE", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
          <CreditCard size={24} />
        </div>
      </div>

      {/* Cobranza Masiva */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Cobranza Masiva
        </p>
        <button
          onClick={notificarMasivoWhatsApp}
          disabled={totalMorosos === 0}
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle size={16} /> Notificar por WhatsApp
        </button>
      </div>
    </div>
  );
}
