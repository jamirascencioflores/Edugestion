// src/pages/SuperAdmin/PlanesPagos/index.jsx

import { useState, useEffect } from "react";
import { Check, Edit2, Loader2, X } from "lucide-react";
import api from "@/api/axiosConfig";
import { toast } from "sonner";

export default function PlanesPagosSA() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    precioMensual: "",
    limiteAlumnos: "",
    permitePortalPadres: false,
    permiteNotificaciones: false,
    permiteReportesPdf: false,
    permiteMarcaBlanca: false,
    permiteFinanzasPro: false,
  });

  const fetchPlanes = async () => {
    try {
      const response = await api.get("/auth/superadmin/planes");
      setPlanes(response.data);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("Error al cargar los planes de suscripción");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //eslint-disable-next-line
    fetchPlanes();
  }, []);

  const handleOpenModal = (plan) => {
    setPlanSeleccionado(plan);
    setFormData({
      precioMensual: plan.precioMensual,
      limiteAlumnos: plan.limiteAlumnos,
      permitePortalPadres: plan.permitePortalPadres,
      permiteNotificaciones: plan.permiteNotificaciones,
      permiteReportesPdf: plan.permiteReportesPdf,
      permiteMarcaBlanca: plan.permiteMarcaBlanca,
      permiteFinanzasPro: plan.permiteFinanzasPro,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/auth/superadmin/planes/${planSeleccionado.id}`, formData);
      toast.success("Plan actualizado correctamente");
      setModalOpen(false);
      fetchPlanes();
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Error al actualizar el plan");
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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Planes y Precios
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Gestiona las características y tarifas de los planes SaaS disponibles
          para las instituciones.
        </p>
      </div>

      {/* GRID DE PLANES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between"
          >
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
                    <span className="text-sm font-normal text-slate-400">
                      / mes
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="p-2 text-slate-400 transition-colors hover:opacity-80"
                  style={{ "--hover-color": "var(--color-primary)" }}
                  title="Editar Plan"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              <div className="space-y-3 my-6 text-sm">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Límite de Alumnos:</span>
                  <span className="font-semibold">
                    {plan.limiteAlumnos >= 999999
                      ? "Ilimitados"
                      : plan.limiteAlumnos}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Características incluidas:
                  </p>
                  {[
                    {
                      label: "Portal de Padres",
                      active: plan.permitePortalPadres,
                    },
                    {
                      label: "Notificaciones Automáticas",
                      active: plan.permiteNotificaciones,
                    },
                    {
                      label: "Reportes y PDFs Avanzados",
                      active: plan.permiteReportesPdf,
                    },
                    {
                      label: "Marca Blanca (Sin logos)",
                      active: plan.permiteMarcaBlanca,
                    },
                    {
                      label: "Finanzas PRO (Morosidad)",
                      active: plan.permiteFinanzasPro,
                    },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {feat.active ? (
                        <Check size={16} className="text-emerald-500" />
                      ) : (
                        <X
                          size={16}
                          className="text-slate-300 dark:text-slate-600"
                        />
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
              onClick={() => handleOpenModal(plan)}
              className="w-full mt-4 py-2.5 text-white font-medium rounded-xl transition-all text-sm shadow-md"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Modificar Configuración
            </button>
          </div>
        ))}
      </div>

      {/* MODAL DE EDICIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Editar Plan: {planSeleccionado?.nombre}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Precio Mensual (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioMensual}
                  onChange={(e) =>
                    setFormData({ ...formData, precioMensual: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "var(--color-primary)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Límite de Alumnos
                </label>
                <input
                  type="number"
                  value={formData.limiteAlumnos}
                  onChange={(e) =>
                    setFormData({ ...formData, limiteAlumnos: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": "var(--color-primary)" }}
                  required
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Permisos y Módulos
                </p>
                {[
                  { key: "permitePortalPadres", label: "Portal de Padres" },
                  {
                    key: "permiteNotificaciones",
                    label: "Notificaciones Automáticas",
                  },
                  {
                    key: "permiteReportesPdf",
                    label: "Reportes y PDFs Avanzados",
                  },
                  { key: "permiteMarcaBlanca", label: "Marca Blanca" },
                  { key: "permiteFinanzasPro", label: "Finanzas PRO" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData[item.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 w-4 h-4"
                      style={{ accentColor: "var(--color-primary)" }}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors shadow-md"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
