// src/pages/Director/GestionAcademica/MallaCurricular/index.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Network, Copy } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import ModalAsignacion from "./ModalAsignacion";
import ModalClonarMalla from "./ModalClonarMalla";
import TablaAsignaciones from "./TablaAsignaciones";

export default function MallaCurricular() {
  const [grados, setGrados] = useState([]);
  const [seccionesTotales, setSeccionesTotales] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalClonar, setShowModalClonar] = useState(false);
  const [asignacionEdit, setAsignacionEdit] = useState(null);

  const seccionesFiltradas = gradoSeleccionado
    ? seccionesTotales.filter((s) => s.gradoId === Number(gradoSeleccionado))
    : [];

  const fetchAsignaciones = useCallback(async (seccionId) => {
    if (!seccionId) {
      setAsignaciones([]);
      return;
    }
    try {
      const res = await api.get(
        `/academicos/asignaciones/seccion/${seccionId}`,
      );
      setAsignaciones(res.data);
    } catch {
      toast.error("Error al cargar la malla curricular");
    }
  }, []);

  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const [resGrados, resSecciones, resCursos, resDocentes] =
          await Promise.all([
            api.get("/academicos/grados"),
            api.get("/academicos/secciones"),
            api.get("/academicos/cursos"),
            api.get("/auth/docentes"),
          ]);

        const gradosActivos = resGrados.data.filter((g) => g.estado);
        const seccionesActivas = resSecciones.data.filter((s) => s.estado);

        setGrados(gradosActivos);
        setSeccionesTotales(seccionesActivas);
        setCursos(resCursos.data.filter((c) => c.estado));
        setDocentes(resDocentes.data);

        if (gradosActivos.length > 0) {
          const primerGradoId = String(gradosActivos[0].id);
          setGradoSeleccionado(primerGradoId);

          const primerSeccion = seccionesActivas.find(
            (s) => s.gradoId === Number(primerGradoId),
          );
          if (primerSeccion) {
            setSeccionSeleccionada(String(primerSeccion.id));
            fetchAsignaciones(String(primerSeccion.id));
          }
        }
      } catch {
        toast.error("Error al cargar los catálogos académicos");
      }
    };
    fetchCatalogos();
  }, [fetchAsignaciones]);

  const handleSeleccionarGrado = (gradoId) => {
    setGradoSeleccionado(gradoId);

    const primerasSecciones = seccionesTotales.filter(
      (s) => s.gradoId === Number(gradoId),
    );

    if (primerasSecciones.length > 0) {
      const nuevaSeccionId = String(primerasSecciones[0].id);
      setSeccionSeleccionada(nuevaSeccionId);
      fetchAsignaciones(nuevaSeccionId);
    } else {
      setSeccionSeleccionada("");
      setAsignaciones([]);
    }
  };

  const handleSeleccionarSeccion = (seccionId) => {
    setSeccionSeleccionada(seccionId);
    fetchAsignaciones(seccionId);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Network size={24} style={{ color: "var(--color-primary)" }} />
            <span>Malla Curricular</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Distribución oficial de materias y docentes por aula
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowModalClonar(true)}
            disabled={!seccionSeleccionada || asignaciones.length === 0}
            className="px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Copy size={16} /> Copiar Malla
          </button>

          <button
            onClick={() => {
              setAsignacionEdit(null);
              setShowModal(true);
            }}
            disabled={!seccionSeleccionada}
            style={{
              backgroundColor: seccionSeleccionada
                ? "var(--color-primary)"
                : "",
            }}
            className={`px-3.5 py-2.5 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs ${
              !seccionSeleccionada
                ? "bg-slate-400 cursor-not-allowed opacity-50"
                : "hover:opacity-90"
            }`}
          >
            <Plus size={16} /> Asignar Curso
          </button>
        </div>
      </div>

      {/* Navegación por Pills / Tabs Deslizables */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700 space-y-4">
        {/* Pills de Grados */}
        <div>
          <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Grados Académicos
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {grados.map((g) => {
              const isSelected = String(g.id) === String(gradoSeleccionado);
              return (
                <button
                  key={g.id}
                  onClick={() => handleSeleccionarGrado(String(g.id))}
                  style={
                    isSelected
                      ? { backgroundColor: "var(--color-primary)" }
                      : {}
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {g.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pills de Secciones del Grado Activo */}
        {seccionesFiltradas.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Secciones Disponibles
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {seccionesFiltradas.map((s) => {
                const isSelected = String(s.id) === String(seccionSeleccionada);
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSeleccionarSeccion(String(s.id))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      isSelected
                        ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    Sección {s.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tabla / Cards de Asignaciones */}
      {seccionSeleccionada ? (
        <TablaAsignaciones
          asignaciones={asignaciones}
          cursos={cursos}
          docentes={docentes}
          onRefresh={() => fetchAsignaciones(seccionSeleccionada)}
          onEdit={(a) => {
            setAsignacionEdit(a);
            setShowModal(true);
          }}
        />
      ) : (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay secciones configuradas en este grado.
          </p>
        </div>
      )}

      {/* Modales */}
      {showModal && (
        <ModalAsignacion
          key={asignacionEdit?.id || "nuevo"}
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchAsignaciones(seccionSeleccionada)}
          seccionId={Number(seccionSeleccionada)}
          cursos={cursos}
          docentes={docentes}
          asignacion={asignacionEdit}
          asignaciones={asignaciones}
        />
      )}

      {showModalClonar && (
        <ModalClonarMalla
          onClose={() => setShowModalClonar(false)}
          onSuccess={() => fetchAsignaciones(seccionSeleccionada)}
          seccionOrigenId={Number(seccionSeleccionada)}
          secciones={seccionesTotales}
          grados={grados}
        />
      )}
    </div>
  );
}
