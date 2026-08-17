// src/pages/Director/Finanzas/Caja/index.jsx
import { useState, useEffect } from "react";
import { Search, CreditCard, AlertCircle, History } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import TablaDeudas from "./TablaDeudas";
import ModalPago from "../Pagos/ModalPago";
import ModalHistorial from "../Pagos/ModalHistorial";
import Swal from "sweetalert2";

export default function CajaIndex() {
  const [busqueda, setBusqueda] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [deudas, setDeudas] = useState([]);
  const [loadingDeudas, setLoadingDeudas] = useState(false);

  // Estados para los modales
  const [openModalPago, setOpenModalPago] = useState(false);
  const [openModalHistorial, setOpenModalHistorial] = useState(false);
  const [deudaSeleccionada, setDeudaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const [estRes, gradosRes, seccionesRes] = await Promise.all([
          api.get("/academicos/estudiantes"),
          api.get("/academicos/grados"),
          api.get("/academicos/secciones"),
        ]);
        setEstudiantes(estRes.data);
        setGrados(gradosRes.data);
        setSecciones(seccionesRes.data);
      } catch {
        toast.error("Error al cargar la información inicial");
      }
    };
    fetchInicial();
  }, []);

  const resultadosBusqueda =
    busqueda.trim() === ""
      ? []
      : estudiantes
          .filter(
            (e) =>
              e.dni?.includes(busqueda) ||
              `${e.nombres} ${e.apellidos}`
                .toLowerCase()
                .includes(busqueda.toLowerCase()),
          )
          .slice(0, 5);

  const seleccionarEstudiante = async (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setBusqueda("");
    await cargarDeudas(estudiante.id);
  };

  const cargarDeudas = async (estudianteId) => {
    setLoadingDeudas(true);
    try {
      const res = await api.get(`/finanzas/deudas/estudiante/${estudianteId}`);
      setDeudas(res.data);
    } catch {
      toast.error("Error al cargar el estado de cuenta");
    } finally {
      setLoadingDeudas(false);
    }
  };

  const abrirModalPago = (deuda) => {
    setDeudaSeleccionada(deuda);
    setOpenModalPago(true);
  };

  const handleConfirmarPago = async ({ metodoPago, numeroOperacion }) => {
    try {
      await api.put(`/finanzas/deudas/${deudaSeleccionada.id}/pagar`, {
        metodoPago,
        numeroOperacion,
      });
      toast.success("Pago registrado correctamente");
      setOpenModalPago(false);
      setDeudaSeleccionada(null);
      await cargarDeudas(estudianteSeleccionado.id);
    } catch {
      toast.error("Error al procesar el pago");
    }
  };

  const revertirPago = async (deuda) => {
    const { value: motivo, isConfirmed } = await Swal.fire({
      title: "¿Revertir Pago?",
      html: `<p style="font-size: 0.9em; color: #64748b; margin-bottom: 12px;">Esta acción anulará el recibo seleccionado y <b>generará un registro de auditoría</b> vinculado a su usuario. Por favor, especifique el motivo detallado de esta anulación.</p>`,
      input: "textarea",
      inputPlaceholder: "Escriba el motivo de la anulación (requerido)...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, revertir pago",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) return "Debe ingresar un motivo para auditoría";
      },
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-semibold px-4 py-2",
        cancelButton: "rounded-xl font-semibold px-4 py-2",
      },
    });

    if (isConfirmed) {
      try {
        await api.put(`/finanzas/deudas/${deuda.id}/revertir`, { motivo });
        toast.success("Pago revertido correctamente");
        await cargarDeudas(estudianteSeleccionado.id);
      } catch {
        toast.error("Error al revertir el pago");
      }
    }
  };

  const obtenerNombreGrado = (estudiante) => {
    if (!estudiante) return "Grado no asignado";
    if (estudiante.seccion?.grado?.nombre)
      return estudiante.seccion.grado.nombre;
    if (estudiante.gradoNombre) return estudiante.gradoNombre;

    const idSeccionEstudiante = estudiante.seccion?.id || estudiante.seccionId;
    const seccionEncontrada = secciones.find(
      (s) => String(s.id) === String(idSeccionEstudiante),
    );

    const idGradoResolver =
      estudiante.gradoId ||
      estudiante.seccion?.gradoId ||
      seccionEncontrada?.gradoId;

    const gradoEncontrado = grados.find(
      (g) => String(g.id) === String(idGradoResolver),
    );

    return gradoEncontrado ? gradoEncontrado.nombre : "Grado Asignado";
  };

  const obtenerNombreSeccion = (estudiante) => {
    if (!estudiante) return "A";
    if (estudiante.seccion?.nombre) return estudiante.seccion.nombre;
    if (typeof estudiante.seccion === "string") return estudiante.seccion;
    if (estudiante.seccionNombre) return estudiante.seccionNombre;

    const idSeccionEstudiante = estudiante.seccionId || estudiante.seccion?.id;
    const seccionEncontrada = secciones.find(
      (s) => String(s.id) === String(idSeccionEstudiante),
    );

    return seccionEncontrada ? seccionEncontrada.nombre : "A";
  };

  const totalPagado = deudas
    .filter((d) => d.estado === "PAGADA")
    .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

  const totalPendiente = deudas
    .filter((d) => d.estado !== "PAGADA")
    .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

  const getIniciales = (nombres, apellidos) => {
    const n = nombres ? nombres.charAt(0) : "";
    const a = apellidos ? apellidos.charAt(0) : "";
    return `${n}${a}`.toUpperCase() || "AL";
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CreditCard size={24} style={{ color: "var(--color-primary)" }} />
            <span>Módulo de Caja</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Busca un estudiante para gestionar el cobro de pensiones y consultar
            su estado de cuenta.
          </p>
        </div>

        <button
          onClick={() => setOpenModalHistorial(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 border border-purple-200 dark:border-purple-800 text-[var(--color-primary)] hover:bg-purple-50 dark:hover:bg-purple-950/40 bg-white dark:bg-slate-800 py-2.5 px-4 rounded-xl transition-all shadow-xs font-semibold text-xs sm:text-sm"
        >
          <History size={16} />
          Ver Historial de Caja
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL IZQUIERDO: Búsqueda y Alumno */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 relative">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Buscar Estudiante
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por DNI o Apellidos..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {resultadosBusqueda.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden left-0">
                {resultadosBusqueda.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => seleccionarEstudiante(est)}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50/50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {getIniciales(est.nombres, est.apellidos)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {est.nombres} {est.apellidos}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        DNI: {est.dni}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tarjeta del Estudiante Seleccionado */}
          {estudianteSeleccionado && (
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-base border border-purple-200 dark:border-purple-800 shadow-xs shrink-0">
                  {getIniciales(
                    estudianteSeleccionado.nombres,
                    estudianteSeleccionado.apellidos,
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug truncate">
                    {estudianteSeleccionado.nombres}{" "}
                    {estudianteSeleccionado.apellidos}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    DNI:{" "}
                    <span className="font-mono font-semibold">
                      {estudianteSeleccionado.dni}
                    </span>
                  </p>
                </div>
              </div>

              {/* Badges Grado y Sección */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                  {obtenerNombreGrado(estudianteSeleccionado)}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                  Sección {obtenerNombreSeccion(estudianteSeleccionado)}
                </span>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 pt-1">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Total Pagado
                  </span>
                  <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    S/ {totalPagado.toFixed(2)}
                  </span>
                </div>

                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-1">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pendiente
                  </span>
                  <span className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300 font-mono">
                    S/ {totalPendiente.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PANEL DERECHO: Lista de Pensiones y Deudas */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[420px] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                Estado de Cuenta - Pensiones Mensuales
              </h2>
            </div>

            <div className="p-4 sm:p-5 flex-1">
              {!estudianteSeleccionado ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-16">
                  <Search size={48} className="opacity-20" />
                  <p className="text-xs sm:text-sm text-center">
                    Busca y selecciona un estudiante para ver sus deudas.
                  </p>
                </div>
              ) : loadingDeudas ? (
                <div className="h-full flex justify-center items-center py-16">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "var(--color-primary)" }}
                  ></div>
                </div>
              ) : deudas.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-16">
                  <AlertCircle size={48} className="opacity-20" />
                  <p className="text-xs sm:text-sm">
                    Este estudiante no tiene deudas registradas.
                  </p>
                </div>
              ) : (
                <TablaDeudas
                  deudas={deudas}
                  onPagar={abrirModalPago}
                  onRevertir={revertirPago}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalPago
        isOpen={openModalPago}
        deuda={deudaSeleccionada}
        estudiante={estudianteSeleccionado}
        onClose={() => {
          setOpenModalPago(false);
          setDeudaSeleccionada(null);
        }}
        onConfirmarPago={handleConfirmarPago}
      />

      <ModalHistorial
        isOpen={openModalHistorial}
        onClose={() => setOpenModalHistorial(false)}
        estudianteId={estudianteSeleccionado?.id}
        deudas={deudas}
      />
    </div>
  );
}
