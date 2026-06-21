import { useState, useEffect } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";
import TablaEstudiantes from "./TablaEstudiantes";
import ModalEstudiante from "./ModalEstudiante";

export default function EstudiantesIndex() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [grados, setGrados] = useState([]); // <--- ¡Faltaba declarar esto!

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estudianteEditando, setEstudianteEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroSeccion, setFiltroSeccion] = useState("");

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
      setGrados(graRes.data); // Cargamos los grados
    } catch {
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleOpenModal = (estudiante = null) => {
    setEstudianteEditando(estudiante);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEstudianteEditando(null);
    setIsModalOpen(false);
  };

  // Lógica de filtrado y ordenamiento
  const estudiantesFiltrados = estudiantes
    .filter((est) => {
      const coincideTexto = `${est.nombres} ${est.apellidos} ${est.dni}`
        .toLowerCase()
        .includes(filtroTexto.toLowerCase());

      const seccionDelEstudiante = secciones.find(
        (s) => s.id === est.seccionId,
      );
      const gradoIdDelEstudiante =
        seccionDelEstudiante?.gradoId || seccionDelEstudiante?.grado?.id;

      const coincideGrado = filtroGrado
        ? String(gradoIdDelEstudiante) === filtroGrado
        : true;
      const coincideSeccion = filtroSeccion
        ? String(est.seccionId) === filtroSeccion
        : true;

      return coincideTexto && coincideGrado && coincideSeccion;
    })
    .sort((a, b) => a.apellidos.localeCompare(b.apellidos));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
            style={{ color: "var(--color-primary)" }}
          >
            <GraduationCap
              size={24}
              style={{ color: "var(--color-primary)" }}
            />
            <span className="text-slate-800 dark:text-white">
              Gestión de Estudiantes
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra el registro y matrícula de los alumnos del colegio.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Estudiante</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <input
          placeholder="Buscar por nombre o DNI..."
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          onChange={(e) => setFiltroTexto(e.target.value)}
        />

        {/* Selector Grado */}
        <select
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
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

        {/* Selector Sección */}
        <select
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none disabled:opacity-50"
          value={filtroSeccion}
          disabled={!filtroGrado}
          onChange={(e) => setFiltroSeccion(e.target.value)}
        >
          <option value="">Todas las secciones</option>
          {secciones
            .filter((s) => String(s.gradoId || s.grado?.id) === filtroGrado)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
        </select>
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
