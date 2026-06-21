import { useState, useEffect } from "react";
import { X, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ModalRegistro({
  isOpen,
  onClose,
  onSuccess,
  colegioEdit,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    subdominio: "",
    nombreResponsable: "",
    emailResponsable: "",
    plan: "BÁSICO",
  });

  const [loading, setLoading] = useState(false);
  const [subdominioStatus, setSubdominioStatus] = useState("idle");

  // EFECTO DE CARGA: Solo se ejecuta cuando isOpen cambia a true
  useEffect(() => {
    if (isOpen) {
      if (colegioEdit) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          nombre: colegioEdit.nombre || "",
          subdominio: colegioEdit.subdominio || "",
          plan: colegioEdit.plan || "BÁSICO",
          nombreResponsable:
            colegioEdit.responsableNombre !== "Sin asignar"
              ? colegioEdit.responsableNombre
              : "",
          emailResponsable: "",
        });
      } else {
        setFormData({
          nombre: "",
          subdominio: "",
          nombreResponsable: "",
          emailResponsable: "",
          plan: "BÁSICO",
        });
      }
      setSubdominioStatus("idle");
    }
  }, [isOpen, colegioEdit]);

  // DEBOUNCE: Validación de subdominio
  useEffect(() => {
    if (!isOpen || !!colegioEdit || !formData.subdominio) return;

    const timeoutId = setTimeout(async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get(
          `http://localhost:8080/api/auth/colegios/validar-subdominio?subdominio=${formData.subdominio}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setSubdominioStatus(response.data ? "available" : "taken");
      } catch (error) {
        console.error("Error validando subdominio", error);
        setSubdominioStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.subdominio, colegioEdit, isOpen]);

  // Si el modal no está abierto, no renderizamos NADA en el DOM (esto evita que se quede "pegado")
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subdominio") {
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
      setFormData({ ...formData, [name]: sanitizedValue });
      setSubdominioStatus(sanitizedValue === "" ? "idle" : "checking");
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subdominioStatus === "taken" || subdominioStatus === "checking") return;

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = { Authorization: `Bearer ${token}` };

      if (colegioEdit) {
        await axios.put(
          `http://localhost:8080/api/auth/colegios/${colegioEdit.id}`,
          {
            nombre: formData.nombre,
            plan: formData.plan,
            nombreResponsable: formData.nombreResponsable,
          },
          { headers },
        );
        toast.success("Colegio actualizado con éxito");
      } else {
        await axios.post("http://localhost:8080/api/auth/colegios", formData, {
          headers,
        });
        toast.success("Colegio registrado con éxito");
      }
      onSuccess();
      onClose(); // Cierra el modal de inmediato
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Hubo un error en la operación.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!colegioEdit;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold">
            {isEditing ? "Editar Colegio" : "Registrar Nuevo Colegio"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nombre de la Institución
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-transparent focus:ring-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Subdominio
            </label>
            <div className="relative flex">
              <input
                type="text"
                name="subdominio"
                value={formData.subdominio}
                onChange={handleChange}
                required
                disabled={isEditing}
                placeholder="ej-micolegio"
                className={`w-full px-4 py-2 rounded-l-lg border bg-transparent focus:ring-2 focus:outline-none disabled:opacity-50 pr-10 ${subdominioStatus === "taken" ? "border-red-500 focus:ring-red-200" : subdominioStatus === "available" ? "border-green-500 focus:ring-green-200" : "border-slate-200"}`}
              />
              <div className="absolute right-28 top-1/2 -translate-y-1/2">
                {subdominioStatus === "checking" && (
                  <Loader2 size={18} className="text-slate-400 animate-spin" />
                )}
                {subdominioStatus === "available" && (
                  <CheckCircle2 size={18} className="text-green-500" />
                )}
                {subdominioStatus === "taken" && (
                  <XCircle size={18} className="text-red-500" />
                )}
              </div>
              <span className="bg-slate-100 w-28 justify-center px-4 py-2 rounded-r-lg border-y border-r border-slate-200 text-slate-500 text-sm flex items-center">
                .edugestion.io
              </span>
            </div>
            {subdominioStatus === "taken" && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                Este subdominio ya está en uso. Intenta con otro.
              </p>
            )}
            {subdominioStatus === "available" && (
              <p className="text-xs text-green-500 mt-1 font-medium">
                ¡Subdominio disponible!
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Nombre del Responsable
            </label>
            <input
              type="text"
              name="nombreResponsable"
              value={formData.nombreResponsable}
              onChange={handleChange}
              required
              placeholder="Ej. Juan Pérez"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-transparent focus:ring-2 focus:outline-none"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email del Responsable
              </label>
              <input
                type="email"
                name="emailResponsable"
                value={formData.emailResponsable}
                onChange={handleChange}
                required
                placeholder="admin@colegio.edu"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-transparent focus:ring-2 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1">
              Plan de Suscripción
            </label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-transparent focus:ring-2 focus:outline-none"
            >
              <option value="BÁSICO">Básico</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                subdominioStatus === "checking" ||
                subdominioStatus === "taken"
              }
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
