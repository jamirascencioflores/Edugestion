// src/pages/Director/GestionPersonal/index.jsx
import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Users } from "lucide-react";
import Swal from "sweetalert2"; // <-- Importamos SweetAlert2
import { toast } from "sonner"; // <-- Importamos Sonner
import KpiCards from "./KpiCards";
import TablaDocentes from "./TablaDocentes"; // <-- Ruta corregida
import ModalDocente from "./ModalDocente"; // <-- Ruta corregida
import api from "../../../api/axiosConfig"; // Ajusta la ruta si es necesario

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [docenteEdit, setDocenteEdit] = useState(null); // <-- Opcional: Preparado por si quieres editar docentes luego

  // ✅ Correcto (usa la instancia centralizada 'api'):
  const fetchDocentes = useCallback(async () => {
    try {
      const res = await api.get("/auth/docentes");
      setDocentes(res.data);
    } catch (error) {
      console.error("Error al obtener docentes:", error);
      toast.error("Error al cargar la lista de docentes");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleToggleEstado = async (docente) => {
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El docente pasará a estar ${docente.estado ? "Inactivo" : "Activo"}. ${docente.estado ? "Perderá acceso al portal institucional." : ""}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-primary)",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
    });

    if (!result.isConfirmed) return;

    try {
      // Reutilizamos el endpoint PUT completo que ya armamos en Java
      const payload = {
        nombres: docente.nombres,
        apellidos: docente.apellidos,
        documentoIdentidad: docente.documentoIdentidad,
        email: docente.email,
        especialidad: docente.especialidad,
        estado: !docente.estado, // <-- Invertimos el estado
      };

      await api.put(`/auth/docentes/${docente.id}`, payload);
      toast.success(`Estado actualizado correctamente`);
      fetchDocentes();
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar el estado del docente");
    }
  };

  // Función para eliminar con SweetAlert + Sonner
  const handleEliminarDocente = async (docente) => {
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
      confirmButtonColor: "#ef4444", // Rojo peligro
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar definitivamente",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocentes();
  }, [fetchDocentes]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="text-primary" /> Personal Docente
          </h1>
          <p className="text-sm text-slate-500">
            Gestiona los profesores asignados a tu institución.
          </p>
        </div>
        <button
          onClick={() => {
            setDocenteEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <Plus size={18} />
          Añadir Docente
        </button>
      </div>

      <KpiCards docentes={docentes} />

      {/* Buscador */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Cargando personal docente...
        </div>
      ) : (
        <TablaDocentes
          docentes={docentes}
          onToggleEstado={handleToggleEstado}
          onDelete={handleEliminarDocente}
          onEdit={(docente) => {
            setDocenteEdit(docente);
            setIsModalOpen(true);
          }}
        />
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
