import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/api/axiosConfig";
import { Lock, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SetupPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("El enlace de activación es inválido o ha expirado.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // 1. Llamada al endpoint público de activación
      const res = await api.post("/auth/usuarios/public/activar-cuenta", {
        token: token,
        nuevaPassword: password,
      });

      setExito(true);

      // 2. Redirección forzada hacia el subdominio correcto
      setTimeout(() => {
        // Intentamos obtener el subdominio de la respuesta del backend o del host actual
        const subdominioResp = res.data?.subdominio;
        const currentHost = window.location.hostname; // Ej: "elbuenmaestro.localhost" o "localhost"
        const port = window.location.port ? `:${window.location.port}` : "";

        if (subdominioResp) {
          // Si el backend nos da el subdominio explícito:
          window.location.href = `http://${subdominioResp}.localhost${port}/login`;
        } else if (currentHost.includes(".")) {
          // Si ya estamos navegando sobre el subdominio (ej: elbuenmaestro.localhost)
          window.location.href = `http://${currentHost}${port}/login`;
        } else {
          // Fallback en caso de estar en el dominio raíz puro
          window.location.href = "/login";
        }
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
          err.response?.data?.error ||
          "Ocurrió un error al activar tu cuenta. El enlace podría estar vencido.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Crea tu contraseña
          </h1>
          <p className="text-sm text-slate-500">
            Bienvenido a EduGestión. Ingresa tu nueva contraseña para activar tu
            cuenta e ingresar al sistema.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {exito ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center space-y-2">
            <CheckCircle2 className="mx-auto w-10 h-10 text-green-600" />
            <p className="font-semibold">¡Cuenta activada con éxito!</p>
            <p className="text-xs text-green-600">
              Redirigiendo al inicio de sesión de tu institución...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Repite tu contraseña"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary, #4F46E5)" }}
            >
              {loading ? "Activar cuenta..." : "Activar y Continuar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
