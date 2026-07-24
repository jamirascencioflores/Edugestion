import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api/axiosConfig";

export default function ModalEstudiante({ onClose, onSuccess, estudiante }) {
  const anioActual = new Date().getFullYear();
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD
  const hoy = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    emailInstitucional: "",
    seccionId: "",
    gradoId: "",
    anioEscolar: anioActual,
    fechaInscripcion: hoy, // <- NUEVO: Fecha de matrícula
    estado: true,
    apoderadoIds: [],
  });

  const [initialData, setInitialData] = useState(null);

  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDatosAcademicos = async () => {
      try {
        const [gradosRes, seccionesRes] = await Promise.all([
          api.get("/academicos/grados"),
          api.get("/academicos/secciones"),
        ]);

        setGrados(gradosRes.data);
        setSecciones(seccionesRes.data);

        if (estudiante && estudiante.seccionId) {
          const seccionDelAlumno = seccionesRes.data.find(
            (s) => s.id === estudiante.seccionId,
          );
          const idGrado =
            seccionDelAlumno?.gradoId || seccionDelAlumno?.grado?.id;
          if (idGrado) {
            setGradoSeleccionado(idGrado);
          }
        }
      } catch {
        toast.error("Error al cargar los datos académicos");
      }
    };

    fetchDatosAcademicos();

    if (estudiante) {
      const fechaFormateada = estudiante.fechaNacimiento
        ? new Date(estudiante.fechaNacimiento).toISOString().split("T")[0]
        : "";

      const data = {
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        dni: estudiante.dni,
        fechaNacimiento: fechaFormateada,
        emailInstitucional: estudiante.emailInstitucional || "",
        seccionId: estudiante.seccionId || "",
        gradoId: "",
        anioEscolar: anioActual,
        fechaInscripcion: hoy,
        estado: estudiante.estado,
        apoderadoIds: estudiante.apoderadoIds || [],
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(data);
      setInitialData(data);
    } else {
      setInitialData({ ...formData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudiante]);

  useEffect(() => {
    if (gradoSeleccionado) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, gradoId: gradoSeleccionado }));
    }
  }, [gradoSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      estudiante &&
      JSON.stringify(formData) === JSON.stringify(initialData)
    ) {
      toast.info("No se detectaron cambios");
      onClose();
      return;
    }

    if (!estudiante && (!formData.gradoId || !formData.anioEscolar)) {
      toast.error(
        "El grado y el año escolar son obligatorios para la matrícula",
      );
      return;
    }

    setLoading(true);
    try {
      if (estudiante) {
        await api.put(`/academicos/estudiantes/${estudiante.id}`, formData);
        toast.success("Estudiante actualizado correctamente");
      } else {
        await api.post("/academicos/estudiantes", formData);
        toast.success("Estudiante registrado y matriculado con éxito");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Error al guardar los datos del estudiante");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const seccionesFiltradas = secciones.filter(
    (s) => String(s.gradoId || s.grado?.id) === String(gradoSeleccionado),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-xl shadow-xl overflow-hidden my-8">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {estudiante ? "Editar Estudiante" : "Nuevo Estudiante"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={formData.nombres}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                DNI
              </label>
              <input
                type="text"
                name="dni"
                required
                maxLength="15"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={formData.dni}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none scheme-light dark:scheme-dark"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Institucional (Opcional)
              </label>
              <input
                type="email"
                name="emailInstitucional"
                placeholder="ejemplo@colegio.edu.pe"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={formData.emailInstitucional}
                onChange={handleChange}
              />
            </div>

            {/* Selector de Año Escolar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Año de Matrícula
              </label>
              <input
                type="number"
                name="anioEscolar"
                required
                min="2020"
                max="2100"
                disabled={!!estudiante}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                value={formData.anioEscolar}
                onChange={handleChange}
              />
            </div>

            {/* Fecha de inscripción (Solo visible al crear) */}
            {!estudiante && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Inscripción
                </label>
                <input
                  type="date"
                  name="fechaInscripcion"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none scheme-light dark:scheme-dark"
                  value={formData.fechaInscripcion}
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Grado
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                value={gradoSeleccionado}
                onChange={(e) => {
                  setGradoSeleccionado(e.target.value);
                  setFormData({
                    ...formData,
                    seccionId: "",
                    gradoId: e.target.value,
                  });
                }}
              >
                <option value="">Seleccione un grado...</option>
                {grados.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Sección
              </label>
              <select
                name="seccionId"
                required
                disabled={!gradoSeleccionado}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                value={formData.seccionId}
                onChange={handleChange}
              >
                <option value="">Seleccione una sección...</option>
                {seccionesFiltradas.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
