// src/pages/Director/GestionAcademica/GradosSecciones/index.jsx
import { useState, useEffect } from "react";
import { Plus, Layers } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import GradoCard from "./GradoCard";
import ModalGrado from "./ModalGrado";
import ModalSeccion from "./ModalSeccion";

export default function GradosSecciones() {
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);

  const [showModalGrado, setShowModalGrado] = useState(false);
  const [showModalSeccion, setShowModalSeccion] = useState(false);
  const [gradoEdit, setGradoEdit] = useState(null);
  const [seccionEdit, setSeccionEdit] = useState(null);
  const [gradoDefaultId, setGradoDefaultId] = useState(null);

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
    let active = true;
    const load = async () => {
      try {
        const [resGrados, resSecciones] = await Promise.all([
          api.get("/academicos/grados"),
          api.get("/academicos/secciones"),
        ]);
        if (active) {
          setGrados(resGrados.data);
          setSecciones(resSecciones.data);
        }
      } catch {
        if (active) toast.error("Error al cargar la información académica");
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Encabezado Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Layers size={24} style={{ color: "var(--color-primary)" }} />
            Estructura Académica
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Gestiona los grados académicos y sus respectivas secciones
          </p>
        </div>

        <button
          onClick={() => {
            setGradoEdit(null);
            setShowModalGrado(true);
          }}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="w-full sm:w-auto text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs hover:opacity-90 font-semibold text-sm"
        >
          <Plus size={18} />
          <span>Nuevo Grado</span>
        </button>
      </div>

      {/* Grid de Tarjetas */}
      {grados.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4">
          <p className="text-slate-500 dark:text-slate-400 mb-3 text-sm">
            No hay grados configurados en la institución.
          </p>
          <button
            onClick={() => {
              setGradoEdit(null);
              setShowModalGrado(true);
            }}
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            + Crear el primer grado
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {grados.map((grado) => (
            <GradoCard
              key={grado.id}
              grado={grado}
              secciones={secciones.filter((s) => s.gradoId === grado.id)}
              onRefresh={fetchData}
              onEditGrado={(g) => {
                setGradoEdit(g);
                setShowModalGrado(true);
              }}
              onAddSeccion={(gId) => {
                setSeccionEdit(null);
                setGradoDefaultId(gId);
                setShowModalSeccion(true);
              }}
              onEditSeccion={(sec, gId) => {
                setSeccionEdit(sec);
                setGradoDefaultId(gId);
                setShowModalSeccion(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modales */}
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
          gradoDefaultId={gradoDefaultId}
        />
      )}
    </div>
  );
}
