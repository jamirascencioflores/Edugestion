//src/pages/SuperAdmin/PlanesPagos/index.jsx
import { useState, useEffect } from "react";
import { Loader2, Building2, Layers, Settings } from "lucide-react";
import api from "@/api/axiosConfig";
import { toast } from "sonner";
import PlanCard from "./components/PlanCard";
import EditPlanModal from "./components/EditPlanModal";
import EditSuscripcionModal from "./components/EditSuscripcionModal";

export default function PlanesPagosSA() {
  const [activeTab, setActiveTab] = useState("planes"); // 'planes' | 'suscripciones'
  const [planes, setPlanes] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [modalPlanOpen, setModalPlanOpen] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [modalSuscripcionOpen, setModalSuscripcionOpen] = useState(false);
  const [suscripcionSeleccionada, setSuscripcionSeleccionada] = useState(null);

  const [formDataPlan, setFormDataPlan] = useState({
    precioMensual: "",
    limiteAlumnos: "",
    permitePortalPadres: false,
    permiteNotificaciones: false,
    permiteReportesPdf: false,
    permiteMarcaBlanca: false,
    permiteFinanzasPro: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPlanes, resSuscripciones] = await Promise.allSettled([
        api.get("/auth/superadmin/planes"),
        api.get("/auth/superadmin/suscripciones"),
      ]);

      if (resPlanes.status === "fulfilled") setPlanes(resPlanes.value.data);
      if (resSuscripciones.status === "fulfilled")
        setSuscripciones(resSuscripciones.value.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al sincronizar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [resPlanes, resSuscripciones] = await Promise.allSettled([
          api.get("/auth/superadmin/planes"),
          api.get("/auth/superadmin/suscripciones"),
        ]);

        if (isMounted) {
          if (resPlanes.status === "fulfilled") setPlanes(resPlanes.value.data);
          if (resSuscripciones.status === "fulfilled")
            setSuscripciones(resSuscripciones.value.data);
        }
      } catch (error) {
        console.error("Error al cargar datos en el efecto:", error);
        if (isMounted) toast.error("Error al sincronizar datos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers para Planes
  const handleOpenEditPlan = (plan) => {
    setPlanSeleccionado(plan);
    setFormDataPlan({ ...plan });
    setModalPlanOpen(true);
  };

  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/auth/superadmin/planes/${planSeleccionado.id}`,
        formDataPlan,
      );
      toast.success("Plan base actualizado correctamente");
      setModalPlanOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Error al actualizar el plan base");
    }
  };

  // Handlers para Suscripciones de Colegios
  const handleOpenEditSuscripcion = (suscripcion) => {
    setSuscripcionSeleccionada(suscripcion);
    setModalSuscripcionOpen(true);
  };

  const handleSubmitSuscripcion = async (colegioId, data) => {
    try {
      await api.put(
        `/auth/superadmin/suscripciones/colegio/${colegioId}`,
        data,
      );
      toast.success("Suscripción de colegio actualizada");
      setModalSuscripcionOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Error al guardar la suscripción");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-slate-400" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Planes y Tarifas SaaS
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Administra la oferta general o personaliza módulos y cobros por cada
            colegio.
          </p>
        </div>

        {/* NAVEGACIÓN TABS */}
        <div className="flex bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("planes")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "planes"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Layers size={16} /> Planes Base
          </button>
          <button
            onClick={() => setActiveTab("suscripciones")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "suscripciones"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Building2 size={16} /> Suscripciones por Colegio
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: PLANES BASE */}
      {activeTab === "planes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...planes]
            .sort((a, b) => Number(a.precioMensual) - Number(b.precioMensual))
            .map((plan) => (
              <PlanCard key={plan.id} plan={plan} onEdit={handleOpenEditPlan} />
            ))}
        </div>
      )}

      {/* PESTAÑA 2: SUSCRIPCIONES POR COLEGIO */}
      {activeTab === "suscripciones" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-slate-500">
                <th className="p-4">Colegio</th>
                <th className="p-4">Plan Base</th>
                <th className="p-4">Módulos Activos</th>
                <th className="p-4">Extra Adicional</th>
                <th className="p-4">Mensualidad Total</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {suscripciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No hay suscripciones registradas aún.
                  </td>
                </tr>
              ) : (
                suscripciones.map((sub) => {
                  // 1. Vincular con el plan fresco del estado 'planes'
                  const planActual =
                    planes.find(
                      (p) =>
                        p.id === sub.planBaseId ||
                        p.id === sub.planBase?.id ||
                        p.nombre?.toUpperCase() ===
                          sub.planBase?.nombre?.toUpperCase(),
                    ) || sub.planBase;

                  const precioBaseVigente = Number(
                    planActual?.precioMensual || 0,
                  );
                  const extraAdicional = Number(sub.montoAdicional || 0);
                  const totalRecalculado = precioBaseVigente + extraAdicional;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                    >
                      <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                        {sub.nombreColegio || `Colegio ID #${sub.colegioId}`}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {planActual?.nombre || "Sin Plan"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {sub.permitePortalPadres && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold">
                              Padres
                            </span>
                          )}
                          {sub.permiteNotificaciones && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 px-2 py-0.5 rounded font-semibold">
                              Avisos
                            </span>
                          )}
                          {sub.permiteReportesPdf && (
                            <span className="text-[10px] bg-purple-50 text-purple-600 dark:bg-purple-950/40 px-2 py-0.5 rounded font-semibold">
                              PDFs
                            </span>
                          )}
                          {sub.permiteMarcaBlanca && (
                            <span className="text-[10px] bg-amber-50 text-amber-600 dark:bg-amber-950/40 px-2 py-0.5 rounded font-semibold">
                              M.Blanca
                            </span>
                          )}
                          {sub.permiteFinanzasPro && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 px-2 py-0.5 rounded font-semibold">
                              Fin.PRO
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">
                        + S/ {extraAdicional.toFixed(2)}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white font-mono">
                        S/ {totalRecalculado.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenEditSuscripcion(sub)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Personalizar Módulos y Tarifas"
                        >
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALES */}
      {modalPlanOpen && (
        <EditPlanModal
          plan={planSeleccionado}
          formData={formDataPlan}
          setFormData={setFormDataPlan}
          onClose={() => setModalPlanOpen(false)}
          onSubmit={handleSubmitPlan}
        />
      )}

      {modalSuscripcionOpen && (
        <EditSuscripcionModal
          key={
            suscripcionSeleccionada?.id || suscripcionSeleccionada?.colegioId
          }
          suscripcion={suscripcionSeleccionada}
          planes={planes} // 👈 Pasamos los planes frescos
          onClose={() => setModalSuscripcionOpen(false)}
          onSubmit={handleSubmitSuscripcion}
        />
      )}
    </div>
  );
}
