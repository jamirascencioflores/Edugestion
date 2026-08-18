import { useState, useEffect } from "react";
import { Plus, GraduationCap, Search } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import TablaEstudiantes from "./TablaEstudiantes";
import ModalEstudiante from "./ModalEstudiante";
import KpiCardsEstudiantes from "./KpiCardsEstudiantes";
import { Paginacion } from "../../../../components/common/Paginacion";

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

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 8;

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

  // 1. Filtrado y ordenamiento de estudiantes
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

  // 2. Cálculos de Paginación
  const totalRegistros = estudiantesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const estudiantesPaginados = estudiantesFiltrados.slice(
    indiceInicio,
    indiceInicio + registrosPorPagina,
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <GraduationCap
              size={24}
              style={{ color: "var(--color-primary)" }}
            />
            <span>Gestión de Estudiantes</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra el registro y matrícula de los alumnos del colegio.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="w-full sm:w-auto text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-xs text-sm font-semibold"
        >
          <Plus size={18} />
          <span>Nuevo Estudiante</span>
        </button>
      </div>

      <KpiCardsEstudiantes estudiantes={estudiantes} />

      {/* Buscador + Filtros Responsivos */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={filtroTexto}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              onChange={(e) => {
                setFiltroTexto(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <select
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm"
            value={filtroGrado}
            onChange={(e) => {
              setFiltroGrado(e.target.value);
              setFiltroSeccion("");
              setPaginaActual(1);
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
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none text-sm disabled:opacity-50"
            value={filtroSeccion}
            disabled={!filtroGrado}
            onChange={(e) => {
              setFiltroSeccion(e.target.value);
              setPaginaActual(1);
            }}
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
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold w-full sm:w-fit justify-between sm:justify-start">
          <button
            onClick={() => {
              setFilterEstado("TODOS");
              setPaginaActual(1);
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "TODOS"
                ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Todos ({estudiantes.length})
          </button>
          <button
            onClick={() => {
              setFilterEstado("MATRICULADOS");
              setPaginaActual(1);
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "MATRICULADOS"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Matriculados ({estudiantes.filter((e) => e.estado).length})
          </button>
          <button
            onClick={() => {
              setFilterEstado("INACTIVOS");
              setPaginaActual(1);
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "INACTIVOS"
                ? "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Retirados ({estudiantes.filter((e) => !e.estado).length})
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
        <div className="space-y-4">
          {/* Contenedor con altura mínima fija para evitar saltos */}
          <div className="min-h-[480px]">
            <TablaEstudiantes
              estudiantes={estudiantesPaginados}
              secciones={secciones}
              grados={grados}
              onRefresh={fetchData}
              onEdit={handleOpenModal}
            />
          </div>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            totalRegistros={totalRegistros}
            registrosPorPagina={registrosPorPagina}
            onCambiarPagina={(nuevaPagina) => setPaginaActual(nuevaPagina)}
          />
        </div>
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
