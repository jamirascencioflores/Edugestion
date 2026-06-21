import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    // Quitamos los bg- y min-h-screen de aquí. Solo dejamos la tipografía.
    <div className="font-sans">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen size={28} style={{ color: "var(--color-primary)" }} />
          <h1 className="text-2xl font-bold tracking-tight">Omnis SaaS</h1>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#modulos"
            className="hidden md:block font-medium hover:text-primary transition-colors"
          >
            Módulos
          </a>
          <button className="font-medium hover:text-primary transition-colors">
            Registrar Colegio
          </button>
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg text-white font-medium shadow-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
          Versión 1.0 lista para colegios
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-4xl">
          Gestión educativa <br />
          <span style={{ color: "var(--color-primary)" }}>
            inteligente y centralizada
          </span>
        </h2>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12">
          La plataforma definitiva para directores y administradores. Gestiona
          matrículas, finanzas y rendimiento académico desde un solo lugar, con
          seguridad de nivel empresarial.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <button
            className="flex justify-center items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:opacity-90 hover:scale-105 transition-all"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Comenzar ahora <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            Agendar una Demo
          </button>
        </div>
      </main>
    </div>
  );
}
