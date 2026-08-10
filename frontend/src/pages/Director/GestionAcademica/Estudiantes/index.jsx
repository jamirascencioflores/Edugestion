//src/pages/Director/GestionAcademica/Estudiantes/index.jsx

import { useState, useEffect } from "react";
import { Plus, GraduationCap, Search } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import TablaEstudiantes from "./TablaEstudiantes";
import ModalEstudiante from "./ModalEstudiante";
import KpiCardsEstudiantes from "./KpiCardsEstudiantes";

export default function EstudiantesIndex() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estudianteEditando, setEstudianteEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");
  const [filterEstado, setFilterEstado] = useState("TODOS");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [estRes, secRes, graRes] = await Promise.all([
        api.get("/academicos/estudiantes"),
        api.get("/academicos/secciones"),
        api.get("/academicos/grados"),
      ]);
      setEstudiantes(estRes.data);
      setSecciones(secRes.data);
      setGrados(graRes.data);
    } catch {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [estRes, secRes, graRes] = await Promise.all([
          api.get("/academicos/estudiantes"),
          api.get("/academicos/secciones"),
          api.get("/academicos/grados"),
        ]);
        if (isMounted) {
          setEstudiantes(estRes.data);
          setSecciones(secRes.data);
          setGrados(graRes.data);
        }
      } catch {
        if (isMounted) toast.error("Error al cargar los datos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = (estudiante = null) => {
    setEstudianteEditando(estudiante);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEstudianteEditando(null);
    setIsModalOpen(false);
  };

  // Lógica de filtrado
  const estudiantesFiltrados = estudiantes
    .filter((est) => {
      const coincideTexto = `${est.nombres} ${est.apellidos} ${est.dni}`
        .toLowerCase()
        .includes(filtroTexto.toLowerCase());

      const seccionDelEstudiante = secciones.find(
        (s) => String(s.id) === String(est.seccionId),
      );
      const gradoIdDelEstudiante =
        seccionDelEstudiante?.gradoId || seccionDelEstudiante?.grado?.id;

      const coincideGrado = filtroGrado
        ? String(gradoIdDelEstudiante) === filtroGrado
        : true;
      const coincideSeccion = filtroSeccion
        ? String(est.seccionId) === filtroSeccion
        : true;

      let coincideEstado = true;
      if (filterEstado === "MATRICULADOS") coincideEstado = est.estado === true;
      if (filterEstado === "INACTIVOS") coincideEstado = est.estado === false;

      return (
        coincideTexto && coincideGrado && coincideSeccion && coincideEstado
      );
    })
    .sort((a, b) => a.apellidos.localeCompare(b.apellidos));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <GraduationCap
              size={24}
              style={{ color: "var(--color-primary)" }}
            />
            <span>Gestión de Estudiantes</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra el registro y matrícula de los alumnos del colegio.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-90 shadow-sm text-sm font-semibold"
        >
          <Plus size={18} />
          <span>Nuevo Estudiante</span>
        </button>
      </div>

      {/* KPI Cards (AQUÍ ESTÁ AGREGADO) */}
      <KpiCardsEstudiantes estudiantes={estudiantes} />

      {/* Contenedor de Búsqueda + Filtros */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o DNI..."
              value={filtroTexto}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm"
            value={filtroGrado}
            onChange={(e) => {
              setFiltroGrado(e.target.value);
              setFiltroSeccion("");
            }}
          >
            <option value="">Todos los grados</option>
            {grados.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm disabled:opacity-50"
            value={filtroSeccion}
            disabled={!filtroGrado}
            onChange={(e) => setFiltroSeccion(e.target.value)}
          >
            <option value="">Todas las secciones</option>
            {secciones
              .filter((s) => String(s.gradoId || s.grado?.id) === filtroGrado)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  Sección {s.nombre}
                </option>
              ))}
          </select>
        </div>

        {/* Pills de Estado */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold w-fit">
          <button
            onClick={() => setFilterEstado("TODOS")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "TODOS"
                ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Todos ({estudiantes.length})
          </button>
          <button
            onClick={() => setFilterEstado("MATRICULADOS")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "MATRICULADOS"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Matriculados ({estudiantes.filter((e) => e.estado).length})
          </button>
          <button
            onClick={() => setFilterEstado("INACTIVOS")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "INACTIVOS"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Retirados/Inactivos ({estudiantes.filter((e) => !e.estado).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--color-primary)" }}
          ></div>
        </div>
      ) : (
        <TablaEstudiantes
          estudiantes={estudiantesFiltrados}
          secciones={secciones}
          grados={grados}
          onRefresh={fetchData}
          onEdit={handleOpenModal}
        />
      )}

      {isModalOpen && (
        <ModalEstudiante
          onClose={handleCloseModal}
          onSuccess={fetchData}
          estudiante={estudianteEditando}
        />
      )}
    </div>
  );
}
