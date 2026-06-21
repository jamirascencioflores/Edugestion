import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner"; // <-- Importamos Sonner

export default function ModalDocente({
  isOpen,
  onClose,
  onSuccess,
  docenteEdit,
}) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    documentoIdentidad: "",
    email: "",
    especialidad: "",
  });
  const [loading, setLoading] = useState(false);

  // Efecto corregido con setTimeout para evitar el "cascading render" en ESLint
  useEffect(() => {
    const timer = setTimeout(() => {
      if (docenteEdit) {
        setFormData({
          nombres: docenteEdit.nombres || "",
          apellidos: docenteEdit.apellidos || "",
          documentoIdentidad: docenteEdit.documentoIdentidad || "",
          email: docenteEdit.email || "",
          especialidad: docenteEdit.especialidad || "",
        });
      } else {
        setFormData({
          nombres: "",
          apellidos: "",
          documentoIdentidad: "",
          email: "",
          especialidad: "",
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [docenteEdit, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!docenteEdit;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt_token");
      const headers = { Authorization: `Bearer ${token}` };

      if (isEditing) {
        // Modo Edición (PUT)
        await axios.put(
          `http://localhost:8080/api/auth/docentes/${docenteEdit.id}`,
          formData,
          { headers },
        );
        toast.success("Docente actualizado con éxito");
      } else {
        // Modo Registro (POST)
        await axios.post("http://localhost:8080/api/auth/docentes", formData, {
          headers,
        });
        toast.success("Docente registrado con éxito");
      }

      onSuccess(); // Recarga la tabla
      onClose(); // Cierra el modal
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "No se pudo completar la operación";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold">
            {isEditing ? "Editar Docente" : "Registrar Nuevo Docente"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Nombres
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Documento (DNI/CE)
              </label>
              <input
                type="text"
                name="documentoIdentidad"
                value={formData.documentoIdentidad}
                onChange={handleChange}
                required
                disabled={isEditing} // Bloqueamos el DNI en edición
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Especialidad
              </label>
              <input
                type="text"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Ej. Matemáticas"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent focus:ring-2 focus:outline-none"
            />
          </div>

          {!isEditing && (
            <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-lg text-xs font-medium">
              Nota: La contraseña inicial del docente será su número de
              Documento (DNI/CE). El sistema le obligará a cambiarla en su
              primer inicio de sesión.
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Actualizar"
                  : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
