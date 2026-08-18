// src/pages/Director/GestionPersonal/index.jsx
import { useState, useEffect } from "react";
import { Plus, Search, Users } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import KpiCards from "./KpiCards";
import TablaDocentes from "./TablaDocentes";
import ModalDocente from "./ModalDocente";
import { Paginacion } from "../../../components/common/Paginacion";
import api from "../../../api/axiosConfig";

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docenteEdit, setDocenteEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("TODOS");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 8;

  const fetchDocentes = async () => {
    try {
      const res = await api.get("/auth/docentes");
      setDocentes(res.data);
    } catch (error) {
      console.error("Error al obtener docentes:", error);
      toast.error("Error al cargar la lista de docentes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const res = await api.get("/auth/docentes");
        if (active) {
          setDocentes(res.data);
        }
      } catch (error) {
        if (active) {
          console.error("Error al obtener docentes:", error);
          toast.error("Error al cargar la lista de docentes");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleToggleEstado = async (docente) => {
    const isDark = document.documentElement.classList.contains("dark");
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El docente pasará a estar ${
        docente.estado ? "Inactivo" : "Activo"
      }. ${docente.estado ? "Perderá acceso al portal institucional." : ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: docente.estado ? "#f59e0b" : "#10b981",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#f1f5f9" : "#0f172a",
    });

    if (!result.isConfirmed) return;

    try {
      const payload = {
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        documentoIdentidad: docente.documentoIdentidad,
        email: docente.email,
        especialidad: docente.especialidad,
        estado: !docente.estado,
      };

      await api.put(`/auth/docentes/${docente.id}`, payload);
      toast.success("Estado actualizado correctamente");
      fetchDocentes();
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar el estado del docente");
    }
  };

  const handleEliminarDocente = async (docente) => {
    const isDark = document.documentElement.classList.contains("dark");
    const nombreCompleto =
      `${docente.nombres} ${docente.apellidos}`.toLowerCase();
    const dni = docente.documentoIdentidad;

    const result = await Swal.fire({
      title: "¡ADVERTENCIA CRÍTICA!",
      html: `
        <div class="text-left">
          <p class="mb-3 text-sm text-red-500 font-bold">
            Eliminar a un docente es una acción destructiva e irreversible.
          </p>
          <p class="mb-4 text-sm dark:text-slate-300 text-slate-600">
            Podría desencadenar la pérdida de <b>notas, promedios, cursos asignados</b> y registros históricos asociados a este perfil.
          </p>
          <p class="text-sm dark:text-slate-300 text-slate-600">
            Para confirmar, escribe el DNI (<b>${dni}</b>) o su nombre completo.
          </p>
        </div>
      `,
      icon: "error",
      input: "text",
      inputPlaceholder: "Escribe aquí para confirmar...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
      background: isDark ? "#1e293b" : "#ffffff",
      color: isDark ? "#f1f5f9" : "#0f172a",
      inputValidator: (value) => {
        if (!value) {
          return "Debes escribir el DNI o el nombre para confirmar.";
        }
        const textoEscrito = value.trim().toLowerCase();
        if (textoEscrito !== dni && textoEscrito !== nombreCompleto) {
          return "El texto no coincide. Verifica los espacios o el DNI.";
        }
      },
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/auth/docentes/${docente.id}`);
        toast.success("Docente eliminado correctamente del sistema");
        fetchDocentes();
      } catch (error) {
        console.error(error);
        toast.error(
          "Error al eliminar el docente. Podría tener registros vinculados.",
        );
      }
    }
  };

  // 1. Filtrado
  const filteredDocentes = docentes.filter((d) => {
    const matchesSearch =
      d.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentoIdentidad?.includes(searchTerm) ||
      d.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterEstado === "ACTIVOS") return d.estado === true;
    if (filterEstado === "INACTIVOS") return d.estado === false;
    return true;
  });

  // 2. Cálculos de Paginación
  const totalRegistros = filteredDocentes.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const docentesPaginados = filteredDocentes.slice(
    indiceInicio,
    indiceInicio + registrosPorPagina,
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users style={{ color: "var(--color-primary)" }} /> Personal Docente
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Gestiona los profesores asignados a tu institución.
          </p>
        </div>
        <button
          onClick={() => {
            setDocenteEdit(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity text-sm"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Plus size={18} />
          Añadir Docente
        </button>
      </div>

      <KpiCards docentes={docentes} />

      {/* Buscador + Filtro Responsivo */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPaginaActual(1);
            }}
            placeholder="Buscar por nombre, documento o correo..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-semibold w-full md:w-auto justify-between sm:justify-center">
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
            Todos ({docentes.length})
          </button>
          <button
            onClick={() => {
              setFilterEstado("ACTIVOS");
              setPaginaActual(1);
            }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all ${
              filterEstado === "ACTIVOS"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Activos ({docentes.filter((d) => d.estado).length})
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
            Inactivos ({docentes.filter((d) => !d.estado).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500 text-sm font-medium">
          Cargando personal docente...
        </div>
      ) : (
        <div className="space-y-4">
          {/* Contenedor con altura mínima para evitar que la paginación salte */}
          <div className="min-h-[480px]">
            <TablaDocentes
              docentes={docentesPaginados}
              onToggleEstado={handleToggleEstado}
              onDelete={handleEliminarDocente}
              onEdit={(docente) => {
                setDocenteEdit(docente);
                setIsModalOpen(true);
              }}
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

      <ModalDocente
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDocenteEdit(null);
        }}
        onSuccess={fetchDocentes}
        docenteEdit={docenteEdit}
      />
    </div>
  );
}
