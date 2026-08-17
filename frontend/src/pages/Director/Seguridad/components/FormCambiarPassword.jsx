// src/pages/Director/Seguridad/components/FormCambiarPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="xl:col-span-2 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
      <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Key size={18} style={{ color: "var(--color-primary)" }} />
          <span>Cambiar Contraseña</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Te recomendamos utilizar al menos 8 caracteres con números y símbolos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="actual"
              value={form.actual}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña actual"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2.5 pr-10 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nueva Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
              required
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirmar Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmacion"
              value={form.confirmacion}
              onChange={handleChange}
              required
              placeholder="Repite la nueva contraseña"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>{loading ? "Actualizando..." : "Actualizar Contraseña"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
