import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  HelpCircle,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ¡Ahora sí lo usaremos en la flecha!
  const { login } = useAuth(); // Obtenemos la función de login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/usuarios/login",
        {
          email: email,
          password: contrasena,
        },
      );

      const { token, debeCambiarPassword } = response.data;

      login(token);

      if (debeCambiarPassword) {
        navigate("/cambiar-password");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // --- CORRECCIÓN AQUÍ ---
      // Si el status es 503, no hacemos nada para dejar que el interceptor redirija
      if (err.response?.status === 503) return;
      // -----------------------

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Email o contraseña incorrectos.");
      } else {
        setError(
          "Error al conectar con el servidor. Verifica que el Gateway esté encendido.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans">
      {/* Tarjeta Principal (ahora con 'relative' para posicionar la flecha) */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 relative">
        {/* Botón de retroceder */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 -ml-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
          title="Volver al inicio"
        >
          <ArrowLeft size={22} />
        </button>

        {/* Logo / Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
            <GraduationCap
              size={24}
              style={{ color: "var(--color-primary)" }}
            />
            <span className="font-bold text-lg text-slate-800 dark:text-slate-100">
              EduGestión
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Accede a tu panel institucional y recursos educativos.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Correo Institucional
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nombre@colegio.edu.pe"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: "var(--color-primary)" }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-slate-400"
                size={18}
              />
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300"
                style={{ accentColor: "var(--color-primary)" }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Recordar en este equipo
              </span>
            </label>
            <a
              href="#"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition-all mt-6 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? (
              "Verificando..."
            ) : (
              <>
                Ingresar al Portal <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-4 text-slate-400 font-semibold tracking-wider">
              ¿Necesitas Ayuda?
            </span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 flex gap-4 border border-slate-100 dark:border-slate-700">
          <HelpCircle
            className="shrink-0"
            style={{ color: "var(--color-primary)" }}
            size={20}
          />
          <div>
            <h4 className="text-sm font-semibold mb-1">
              ¿Problemas para ingresar?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contacta al departamento de TI de tu institución o utiliza nuestro
              asistente de soporte.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
          <a
            href="#"
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Política de Privacidad
          </a>
          <a
            href="#"
            className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Términos de Servicio
          </a>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Lock size={12} /> Acceso Institucional Seguro
        </div>
      </div>
    </div>
  );
}
