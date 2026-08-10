import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../api/axiosConfig";

export default function FormCambiarPassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ actual: "", nueva: "", confirmacion: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nueva !== form.confirmacion) {
      return toast.error("Las contraseñas no coinciden");
    }
    if (form.nueva.length < 8) {
      return toast.error("Mínimo 8 caracteres requeridos");
    }

    setLoading(true);
    try {
      await api.put("/auth/usuarios/cambiar-password", {
        actualPassword: form.actual,
        nuevaPassword: form.nueva,
      });

      toast.success(
        "Contraseña actualizada correctamente. Por favor, inicia sesión de nuevo.",
      );

      // Redirección y cierre de sesión seguro
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al actualizar la contraseña",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
        <Key size={18} style={{ color: "var(--color-primary)" }} /> Cambiar
        Contraseña
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="actual"
              value={form.actual}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nueva Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
              required
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmacion"
              value={form.confirmacion}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}
