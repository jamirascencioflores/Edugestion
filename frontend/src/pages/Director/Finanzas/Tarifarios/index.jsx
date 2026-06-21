import { useState, useEffect } from "react";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import ModalTarifario from "./ModalTarifario";
import TablaTarifario from "./TablaTarifario";

export default function TarifariosIndex() {
  const anioActual = new Date().getFullYear();
  const [tarifarios, setTarifarios] = useState([]);
  const [grados, setGrados] = useState([]);
  const [filtroAnio, setFiltroAnio] = useState(anioActual);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gradosRes, tarifariosRes] = await Promise.all([
        api.get("/academicos/grados"),
        api.get(`/finanzas/tarifarios/anio/${filtroAnio}`),
      ]);
      setGrados(gradosRes.data);
      setTarifarios(tarifariosRes.data);
    } catch {
      toast.error("Error al cargar los tarifarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroAnio]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
            style={{ color: "var(--color-primary)" }}
          >
            <Wallet size={24} style={{ color: "var(--color-primary)" }} />
            <span className="text-slate-800 dark:text-white">
              Tarifario de Pensiones
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configura el costo mensual de la pensión por cada grado.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
        >
          <Plus size={20} />
          <span>Nueva Tarifa</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Filtrar por Año Escolar:
        </label>
        <input
          type="number"
          className="px-4 py-2 w-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          value={filtroAnio}
          onChange={(e) => setFiltroAnio(e.target.value)}
        />
      </div>

      {/* Componente de tabla importado */}
      <TablaTarifario
        tarifarios={tarifarios}
        grados={grados}
        loading={loading}
      />

      {isModalOpen && (
        <ModalTarifario
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
