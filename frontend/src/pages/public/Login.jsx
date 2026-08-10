import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  HelpCircle,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados para el paso de 2FA
  const [step2FA, setStep2FA] = useState(false);
  const [code2FA, setCode2FA] = useState(["", "", "", "", "", ""]);
  const [pendingToken, setPendingToken] = useState(null);
  const [pendingDebeCambiar, setPendingDebeCambiar] = useState(false);

  const navigate = useNavigate();
  const { login, is2FAEnabled } = useAuth();

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newCode = [...code2FA];
    newCode[index] = value;
    setCode2FA(newCode);

    // Salto automático al siguiente input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDownOtp = (e, index) => {
    if (e.key === "Backspace" && !code2FA[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const processSuccessfulLogin = (token, debeCambiar) => {
    login(token);

    if (debeCambiar) {
      navigate("/cambiar-password");
    } else {
      navigate("/dashboard");
    }
  };

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

      // Si el 2FA está habilitado, pasamos a la pantalla de verificación
      if (is2FAEnabled) {
        setPendingToken(token);
        setPendingDebeCambiar(debeCambiarPassword);
        setStep2FA(true);
      } else {
        processSuccessfulLogin(token, debeCambiarPassword);
      }
    } catch (err) {
      if (err.response?.status === 503) return;

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

  const handleVerify2FA = (e) => {
    e.preventDefault();
    const fullCode = code2FA.join("");

    if (fullCode.length < 6) {
      setError("Ingresa el código completo de 6 dígitos.");
      return;
    }

    setLoading(true);
    // Simulación de validación exitosa del token OTP
    setTimeout(() => {
      setLoading(false);
      processSuccessfulLogin(pendingToken, pendingDebeCambiar);
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans">
      {/* SECCIÓN IZQUIERDA: Imagen Inspiradora Educativa */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
          alt="Estudiantes en aula digital"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
            <ShieldCheck className="h-4 w-4" /> Plataforma SaaS Institucional
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight">
            Transformando la gestión educativa en cada aula.
          </h2>
          <p className="mt-2 text-sm text-slate-200">
            Accede a las herramientas de control académico, finanzas y
            comunicación en un solo lugar.
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario de Autenticación */}
      <div className="relative flex w-full items-center justify-center p-6 lg:w-1/2">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          title="Volver al inicio"
        >
          <ArrowLeft size={18} /> Volver al inicio
        </button>

        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-800/80">
          <div className="flex justify-center">
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

          {!step2FA ? (
            /* PASO 1: LOGIN NORMAL */
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Bienvenido de nuevo
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Accede a tu panel institucional y recursos educativos.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in duration-200">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Correo Institucional
                  </Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="nombre@colegio.edu.pe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Contraseña
                  </Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      required
                      className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl w-full text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={recordar}
                      onChange={(e) => setRecordar(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700"
                      style={{ accentColor: "var(--color-primary)" }}
                    />
                    Recordar en este equipo
                  </label>

                  <Link
                    to="/recuperar-password"
                    className="font-medium hover:underline transition-all"
                    style={{ color: "var(--color-primary)" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 transition-all mt-6 disabled:opacity-50 text-sm"
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
            </>
          ) : (
            /* PASO 2: PANTALLA CÓDIGO 2FA */
            <form
              onSubmit={handleVerify2FA}
              className="space-y-6 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="text-center space-y-2">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    opacity: 0.9,
                  }}
                >
                  <KeyRound size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Verificación 2FA
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ingresa el código de 6 dígitos generado por tu aplicación
                  autenticadora.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Inputs OTP */}
              <div className="flex justify-center gap-2">
                {code2FA.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDownOtp(e, index)}
                    autoFocus={index === 0}
                    className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all"
                  />
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep2FA(false);
                    setError("");
                  }}
                  className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2.5 text-xs font-semibold text-white rounded-xl shadow-md transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {loading ? "Validando..." : "Verificar"}
                </button>
              </div>
            </form>
          )}

          {/* Divisor y Soporte */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-3 text-slate-400 font-semibold tracking-wider">
                ¿Necesitas Ayuda?
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex gap-3 border border-slate-100 dark:border-slate-700">
            <HelpCircle
              className="shrink-0 mt-0.5"
              style={{ color: "var(--color-primary)" }}
              size={18}
            />
            <div className="text-xs">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                ¿Problemas para ingresar?
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Contacta al departamento de TI de tu institución o utiliza
                nuestro asistente de soporte.
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 space-y-1 pt-2">
            <div className="flex justify-center gap-3">
              <a href="#" className="hover:underline">
                Política de Privacidad
              </a>
              <span>•</span>
              <a href="#" className="hover:underline">
                Términos de Servicio
              </a>
            </div>
            <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Lock size={12} /> Acceso Institucional Seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
