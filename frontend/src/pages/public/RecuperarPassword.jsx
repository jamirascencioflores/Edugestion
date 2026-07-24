import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMensaje("");

    try {
      await axios.post(
        "http://localhost:8080/api/auth/usuarios/public/recuperar-password",
        { email },
      );
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMensaje(
        "No pudimos procesar tu solicitud. Verifica el correo e intenta nuevamente.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-900 font-sans">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-800/80 relative">
        <Link
          to="/login"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft size={18} /> Volver
        </Link>

        <div className="flex justify-center pt-6">
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

        {status === "success" ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Revisa tu correo
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Hemos enviado un enlace de recuperación a <br />
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {email}
              </span>
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recuperar Contraseña
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Ingresa tu correo institucional y te enviaremos las
                instrucciones para restablecerla.
              </p>
            </div>

            {status === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{mensaje}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Correo Institucional
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nombre@colegio.edu.pe"
                    className="pl-10 py-2.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 w-full text-sm rounded-xl"
                    style={{ focusRingColor: "var(--color-primary)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center py-3 rounded-xl text-white font-semibold shadow-md hover:opacity-90 transition-all mt-4 disabled:opacity-50 text-sm"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {status === "loading"
                  ? "Enviando enlace..."
                  : "Enviar enlace de recuperación"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
