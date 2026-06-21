import { useState, useEffect } from "react";
import { Search, CreditCard, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import TablaDeudas from "./TablaDeudas";
import Swal from "sweetalert2";

export default function CajaIndex() {
  const [busqueda, setBusqueda] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [deudas, setDeudas] = useState([]);
  const [loadingDeudas, setLoadingDeudas] = useState(false);

  // Cargamos los estudiantes una sola vez para búsqueda rápida en memoria (MVP)
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const res = await api.get("/academicos/estudiantes");
        setEstudiantes(res.data);
      } catch {
        toast.error("Error al cargar el directorio de estudiantes");
      }
    };
    fetchEstudiantes();
  }, []);

  // Filtro de búsqueda (DNI o Nombres), limitado a 5 resultados
  const resultadosBusqueda =
    busqueda.trim() === ""
      ? []
      : estudiantes
          .filter(
            (e) =>
              e.dni.includes(busqueda) ||
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

  const registrarPago = async (deuda) => {
    const { value: numeroOp, isConfirmed } = await Swal.fire({
      title: "¿Confirmar cobro?",
      html: `
        <p class="mb-4 text-sm text-slate-600">Se registrará el pago de <b>S/ ${Number(deuda.monto).toFixed(2)}</b>.</p>
        <input id="num-operacion" class="swal2-input !mt-0 !text-sm" placeholder="N° de Operación (Opcional, ej: Yape/Plin)" style="width: 80%;">
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, cobrar",
      cancelButtonText: "Cancelar",
      preConfirm: () => document.getElementById("num-operacion").value,
    });

    if (isConfirmed) {
      try {
        await api.put(`/finanzas/deudas/${deuda.id}/pagar`, {
          numeroOperacion: numeroOp,
        });
        toast.success("Pago registrado correctamente");
        await cargarDeudas(estudianteSeleccionado.id);
      } catch {
        toast.error("Error al procesar el pago");
      }
    }
  };

  const revertirPago = async (deuda) => {
    const { value: motivo, isConfirmed } = await Swal.fire({
      title: "Revertir Pago",
      text: "Indique el motivo de la anulación:",
      input: "text",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // Botón rojo por ser acción destructiva
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, revertir",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) return "Debe ingresar un motivo para auditoría";
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CreditCard size={24} style={{ color: "var(--color-primary)" }} />
            <span>Módulo de Caja</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Busca un estudiante para visualizar y registrar el pago de sus
            pensiones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL IZQUIERDO: Buscador y Perfil */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Buscar Estudiante
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por DNI o Nombres..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Resultados flotantes */}
            {resultadosBusqueda.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden left-0">
                {resultadosBusqueda.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => seleccionarEstudiante(est)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center gap-3"
                  >
                    <User className="text-slate-400" size={18} />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {est.nombres} {est.apellidos}
                      </p>
                      <p className="text-xs text-slate-500">DNI: {est.dni}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tarjeta del Estudiante Seleccionado */}
          {estudianteSeleccionado && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                Datos del Alumno
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="text-slate-500">Nombres:</span> <br />{" "}
                  <span className="font-medium dark:text-slate-300">
                    {estudianteSeleccionado.nombres}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">Apellidos:</span> <br />{" "}
                  <span className="font-medium dark:text-slate-300">
                    {estudianteSeleccionado.apellidos}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">DNI:</span> <br />{" "}
                  <span className="font-medium dark:text-slate-300">
                    {estudianteSeleccionado.dni}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PANEL DERECHO: Estado de Cuenta (Tabla de Deudas) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px] flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Estado de Cuenta
              </h2>
            </div>

            <div className="p-5 flex-1">
              {!estudianteSeleccionado ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <Search size={48} className="opacity-20" />
                  <p>Busca y selecciona un estudiante para ver sus deudas.</p>
                </div>
              ) : loadingDeudas ? (
                <div className="h-full flex justify-center items-center py-12">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{ borderColor: "var(--color-primary)" }}
                  ></div>
                </div>
              ) : deudas.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 py-12">
                  <AlertCircle size={48} className="opacity-20" />
                  <p>Este estudiante no tiene deudas registradas.</p>
                </div>
              ) : (
                <TablaDeudas
                  deudas={deudas}
                  onPagar={registrarPago}
                  onRevertir={revertirPago}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
