import { useState, useEffect } from "react";
import { Plus, ArrowLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../../../../api/axiosConfig";
import ModalCurso from "./ModalCurso";
import TablaCursos from "./TablaCursos"; // <-- Importamos la tabla

export default function GestionCursos() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cursoEdit, setCursoEdit] = useState(null);

  const fetchCursos = async () => {
    try {
      const res = await api.get("/academicos/cursos");
      setCursos(res.data);
    } catch {
      toast.error("Error al cargar los cursos");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCursos();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabecera */}
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
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen size={24} style={{ color: "var(--color-primary)" }} />
              Cursos (Asignaturas)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gestiona el catálogo de materias de la institución
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCursoEdit(null);
            setShowModal(true);
          }}
          style={{ backgroundColor: "var(--color-primary)" }}
          className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-90 shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Curso</span>
        </button>
      </div>

      {/* Tabla Modular */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <TablaCursos
          cursos={cursos}
          onRefresh={fetchCursos}
          onEdit={(c) => {
            setCursoEdit(c);
            setShowModal(true);
          }}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <ModalCurso
          onClose={() => setShowModal(false)}
          onSuccess={fetchCursos}
          curso={cursoEdit}
        />
      )}
    </div>
  );
}
