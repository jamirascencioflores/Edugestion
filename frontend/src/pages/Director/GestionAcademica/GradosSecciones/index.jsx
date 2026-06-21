import { useState, useEffect } from "react";
import { Plus, Layers, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axiosConfig";
import TablaGrados from "./TablaGrados";
import TablaSecciones from "./TablaSecciones";
import ModalGrado from "./ModalGrado";
import ModalSeccion from "./ModalSeccion";

export default function GradosSecciones() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("grados");
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);

  const [showModalGrado, setShowModalGrado] = useState(false);
  const [showModalSeccion, setShowModalSeccion] = useState(false);
  const [gradoEdit, setGradoEdit] = useState(null);
  const [seccionEdit, setSeccionEdit] = useState(null);

  const fetchData = async () => {
    try {
      const [resGrados, resSecciones] = await Promise.all([
        api.get("/academicos/grados"),
        api.get("/academicos/secciones"),
      ]);
      setGrados(resGrados.data);
      setSecciones(resSecciones.data);
    } catch {
      toast.error("Error al cargar la información académica");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabecera con Botón Volver */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
            title="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Grados y Secciones
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gestiona la estructura académica del colegio
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (activeTab === "grados") {
              setGradoEdit(null);
              setShowModalGrado(true);
            } else {
              setSeccionEdit(null);
              setShowModalSeccion(true);
            }
          }}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:opacity-90"
        >
          <Plus size={20} />
          <span>Nuevo {activeTab === "grados" ? "Grado" : "Sección"}</span>
        </button>
      </div>

      {/* Pestañas (Tabs) */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6 w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("grados")}
          style={
            activeTab === "grados" ? { color: "var(--color-primary)" } : {}
          }
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all ${
            activeTab === "grados"
              ? "bg-white dark:bg-slate-700 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers size={18} /> Grados
        </button>
        <button
          onClick={() => setActiveTab("secciones")}
          style={
            activeTab === "secciones" ? { color: "var(--color-primary)" } : {}
          }
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all ${
            activeTab === "secciones"
              ? "bg-white dark:bg-slate-700 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Users size={18} /> Secciones
        </button>
      </div>

      {/* Contenido de Tablas */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "grados" ? (
          <TablaGrados
            grados={grados}
            onRefresh={fetchData}
            onEdit={(g) => {
              setGradoEdit(g);
              setShowModalGrado(true);
            }}
          />
        ) : (
          <TablaSecciones
            secciones={secciones}
            grados={grados} // <-- Asegúrate de pasar esta línea
            onRefresh={fetchData}
            onEdit={(s) => {
              setSeccionEdit(s);
              setShowModalSeccion(true);
            }}
          />
        )}
      </div>

      {/* Modal Grados */}
      {showModalGrado && (
        <ModalGrado
          onClose={() => setShowModalGrado(false)}
          onSuccess={fetchData}
          grado={gradoEdit}
        />
      )}

      {showModalSeccion && (
        <ModalSeccion
          onClose={() => setShowModalSeccion(false)}
          onSuccess={fetchData}
          seccion={seccionEdit}
          grados={grados}
        />
      )}
    </div>
  );
}
