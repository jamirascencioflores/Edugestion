// src/pages/public/Landing.jsx

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Cloud,
  ShieldCheck,
  Headphones,
  Wallet,
  BookOpen,
  Users,
  Check,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  ClipboardList,
  MessageCircle,
  Loader2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import dashboardHero from "@/assets/dashboard-hero.jpg";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
        <GraduationCap className="h-5 w-5" />
      </div>
      <span className="text-xl font-bold text-slate-900">EduGestión</span>
    </div>
  );
}
function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#modulos"
            className="text-sm font-medium text-slate-700 hover:text-purple-600"
          >
            Módulos
          </a>
          <a
            href="#roles"
            className="text-sm font-medium text-slate-700 hover:text-purple-600"
          >
            Roles
          </a>
          <a
            href="#precios"
            className="text-sm font-medium text-slate-700 hover:text-purple-600"
          >
            Precios
          </a>
          <a
            href="#contacto"
            className="text-sm font-medium text-slate-700 hover:text-purple-600"
          >
            Registrar Colegio
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            Nuevo · Versión 2026
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            <span className="text-purple-600">Gestión educativa</span>
            <br />
            inteligente y<br />
            centralizada
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-600">
            Una sola plataforma para administrar finanzas, académico y
            comunicación con padres. Diseñada para colegios modernos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-700 hover:bg-purple-50"
            >
              Agendar una Demo
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-10 top-10 h-72 w-72 rounded-full bg-purple-200/60 blur-3xl" />
          <div className="absolute -left-6 -bottom-8 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl" />
          <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
            <img
              src={dashboardHero}
              alt="Panel de control EduGestión"
              width={1400}
              height={1000}
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
function TrustStrip() {
  const pillars = [
    {
      icon: Cloud,
      title: "100% en la Nube",
      desc: "Accede desde cualquier dispositivo, sin instalaciones.",
    },
    {
      icon: ShieldCheck,
      title: "Datos Seguros",
      desc: "Cifrado de extremo a extremo y respaldos automáticos.",
    },
    {
      icon: Headphones,
      title: "Soporte Dedicado",
      desc: "Equipo humano disponible cuando lo necesites.",
    },
  ];
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-lg font-semibold text-slate-500">
          La base sobre la que confían las instituciones líderes
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Modules() {
  const mods = [
    {
      icon: Wallet,
      title: "Finanzas",
      desc: "Cobros de pensiones, boletas electrónicas y reportes de morosidad en tiempo real.",
      points: [
        "Pagos en línea",
        "Facturación electrónica",
        "Reportes automáticos",
      ],
    },
    {
      icon: BookOpen,
      title: "Académico",
      desc: "Registro de notas, asistencia y planificación curricular para docentes.",
      points: ["Libreta digital", "Control de asistencia", "Planificación"],
    },
    {
      icon: Users,
      title: "Portal de Padres",
      desc: "Comunicación directa con las familias: notas, tareas y comunicados.",
      points: ["App móvil", "Notificaciones", "Chat con docentes"],
    },
  ];
  return (
    <section id="modulos" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Módulos
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Todo lo que tu colegio necesita
          </h2>
          <p className="mt-4 text-slate-600">
            Tres módulos que trabajan juntos para simplificar la gestión
            educativa.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {mods.map((m) => (
            <div
              key={m.title}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-purple-300 hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white">
                <m.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                {m.title}
              </h3>
              <p className="mt-3 text-slate-600">{m.desc}</p>
              <ul className="mt-5 space-y-2">
                {m.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <Check className="h-4 w-4 text-purple-600" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function RolesSection() {
  const [active, setActive] = useState("director");
  const views = {
    director: {
      icon: BarChart3,
      title: "Panel del Director",
      desc: "Métricas clave del colegio en un solo vistazo.",
      bullets: [
        "KPIs de matrícula y morosidad",
        "Reportes financieros consolidados",
        "Indicadores académicos por nivel",
      ],
    },
    docente: {
      icon: ClipboardList,
      title: "Espacio del Docente",
      desc: "Herramientas para el día a día en el aula.",
      bullets: [
        "Registro rápido de notas",
        "Toma de asistencia en 1 clic",
        "Comunicación con padres",
      ],
    },
    padres: {
      icon: MessageCircle,
      title: "Portal de Padres",
      desc: "Toda la información del estudiante al alcance.",
      bullets: [
        "Notas y asistencia al día",
        "Pagos y estados de cuenta",
        "Comunicados del colegio",
      ],
    },
  };
  const view = views[active];
  const Icon = view.icon;
  return (
    <section id="roles" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Diseñado por roles
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Una experiencia para cada usuario
          </h2>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {["director", "docente", "padres"].map((r) => (
              <button
                key={r}
                onClick={() => setActive(r)}
                className={`rounded-full px-6 py-2 text-sm font-medium capitalize transition ${
                  active === r
                    ? "bg-purple-600 text-white"
                    : "text-slate-600 hover:text-purple-600"
                }`}
              >
                {r === "director"
                  ? "Director"
                  : r === "docente"
                    ? "Docente"
                    : "Padres"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-2 lg:p-12">
          <div className="flex flex-col justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-slate-900">
              {view.title}
            </h3>
            <p className="mt-3 text-slate-600">{view.desc}</p>
            <ul className="mt-6 space-y-3">
              {view.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 p-6">
            <div className="flex items-center gap-2 border-b border-purple-200 pb-3">
              <div className="h-3 w-3 rounded-full bg-purple-400" />
              <div className="h-3 w-3 rounded-full bg-purple-300" />
              <div className="h-3 w-3 rounded-full bg-purple-200" />
              <span className="ml-2 text-xs font-semibold text-purple-800">
                {view.title}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {view.bullets.map((b, i) => (
                <div
                  key={b}
                  className="flex items-center justify-between rounded-lg bg-white/80 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-600 text-xs font-semibold text-white">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                      {b}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-purple-600">
                    Ver
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function Pricing() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanesPublicos = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/auth/usuarios/public/planes",
        );
        if (!res.ok) throw new Error("Error en respuesta");
        const data = await res.json();
        if (data && data.length > 0) {
          setPlanes(data);
        } else {
          throw new Error("Sin datos");
        }
      } catch (error) {
        console.warn("Usando fallback de planes:", error);
        // Fallback alineado con tu BD
        setPlanes([
          {
            id: 1,
            nombre: "BÁSICO",
            precioMensual: 180,
            limiteAlumnos: 200,
            permitePortalPadres: false,
            permiteNotificaciones: false,
            permiteReportesPdf: false,
            permiteMarcaBlanca: false,
            permiteFinanzasPro: false,
          },
          {
            id: 2,
            nombre: "ESTÁNDAR",
            precioMensual: 380,
            limiteAlumnos: 500,
            permitePortalPadres: false, // 👈 App Móvil exclusiva de Premium
            permiteNotificaciones: true,
            permiteReportesPdf: true,
            permiteMarcaBlanca: false,
            permiteFinanzasPro: false,
          },
          {
            id: 3,
            nombre: "PREMIUM",
            precioMensual: 690,
            limiteAlumnos: 999999,
            permitePortalPadres: true, // 👈 Exclusivo aquí
            permiteNotificaciones: true,
            permiteReportesPdf: true,
            permiteMarcaBlanca: true,
            permiteFinanzasPro: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanesPublicos();
  }, []);

  const planesOrdenados = [...planes].sort(
    (a, b) => Number(a.precioMensual) - Number(b.precioMensual),
  );

  return (
    <section
      id="precios"
      className="bg-white dark:bg-slate-900 py-24 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Precios
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Planes claros, sin sorpresas
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Elige el plan que mejor se adapta al tamaño de tu institución.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center my-16">
            <Loader2 className="animate-spin text-slate-400" size={36} />
          </div>
        ) : (
          <div className="mx-auto mt-14 grid max-w-6xl gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {planesOrdenados.map((plan) => {
              // El plan del medio (Estándar) lleva el destaque
              const esRecomendado =
                plan.nombre.toUpperCase().includes("ESTÁNDAR") ||
                plan.nombre.toUpperCase().includes("ESTANDAR");

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl bg-white dark:bg-slate-800 p-8 shadow-sm flex flex-col justify-between border-2 transition-all hover:shadow-lg ${
                    esRecomendado
                      ? "shadow-xl border-purple-600 ring-2 ring-purple-600/10"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {esRecomendado && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white bg-purple-600 shadow-sm uppercase tracking-wide">
                      Más Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {plan.nombre}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                      {plan.limiteAlumnos >= 999999
                        ? "Para instituciones educativas de gran escala."
                        : `Para instituciones de hasta ${plan.limiteAlumnos} alumnos.`}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 dark:text-white">
                        S/ {plan.precioMensual}
                      </span>
                      <span className="text-slate-500 text-sm">/mes</span>
                    </div>

                    <a href="#contacto" className="block mt-6">
                      <Button
                        variant={esRecomendado ? "default" : "outline"}
                        className={`w-full font-medium ${
                          esRecomendado
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "border-purple-600 text-purple-600 hover:bg-purple-50"
                        }`}
                      >
                        Comenzar ahora
                      </Button>
                    </a>

                    <ul className="mt-8 space-y-3 text-xs sm:text-sm">
                      <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>
                          {plan.limiteAlumnos >= 999999
                            ? "Alumnos ilimitados"
                            : `Hasta ${plan.limiteAlumnos} alumnos`}
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Gestión Académica y Matrículas</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Gestión de Caja y Cobranzas</span>
                      </li>

                      <li
                        className={`flex items-center gap-2 ${plan.permiteReportesPdf ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 line-through"}`}
                      >
                        <Check
                          className={`h-4 w-4 shrink-0 ${plan.permiteReportesPdf ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`}
                        />
                        <span>Boletas y Recibos en PDF</span>
                      </li>

                      <li
                        className={`flex items-center gap-2 ${plan.permiteNotificaciones ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 line-through"}`}
                      >
                        <Check
                          className={`h-4 w-4 shrink-0 ${plan.permiteNotificaciones ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`}
                        />
                        <span>Notificaciones Automáticas</span>
                      </li>

                      <li
                        className={`flex items-center gap-2 ${plan.permitePortalPadres ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 line-through"}`}
                      >
                        <Check
                          className={`h-4 w-4 shrink-0 ${plan.permitePortalPadres ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`}
                        />
                        <span>Portal de Padres + App Móvil</span>
                      </li>

                      <li
                        className={`flex items-center gap-2 ${plan.permiteFinanzasPro ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 line-through"}`}
                      >
                        <Check
                          className={`h-4 w-4 shrink-0 ${plan.permiteFinanzasPro ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`}
                        />
                        <span>Finanzas PRO (Morosidad)</span>
                      </li>

                      <li
                        className={`flex items-center gap-2 ${plan.permiteMarcaBlanca ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500 line-through"}`}
                      >
                        <Check
                          className={`h-4 w-4 shrink-0 ${plan.permiteMarcaBlanca ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`}
                        />
                        <span>Marca Blanca (Sin logos)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
function FAQ() {
  const items = [
    {
      q: "¿Cuánto tiempo toma implementar EduGestión?",
      a: "En promedio, un colegio está operando en la plataforma en 5 a 10 días hábiles, incluyendo la migración de datos y capacitación al personal.",
    },
    {
      q: "¿Los padres necesitan instalar algo?",
      a: "No. Los padres acceden desde el navegador o desde nuestra app móvil gratuita para iOS y Android.",
    },
    {
      q: "¿Puedo migrar mis datos actuales?",
      a: "Sí. Nuestro equipo te ayuda a importar información desde Excel u otros sistemas educativos sin costo adicional.",
    },
    {
      q: "¿La plataforma cumple con la protección de datos?",
      a: "Cumplimos con las normativas de protección de datos personales y ciframos toda la información en tránsito y en reposo.",
    },
    {
      q: "¿Puedo cancelar en cualquier momento?",
      a: "Sí, no hay contratos de permanencia. Puedes cancelar tu suscripción cuando lo desees.",
    },
  ];
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            FAQs
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Preguntas frecuentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map((it, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-slate-200 bg-white px-5"
            >
              <AccordionTrigger className="text-left text-base font-semibold text-slate-900">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
function Contact() {
  return (
    <section id="contacto" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Contacto
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Hablemos sobre tu colegio
          </h2>
          <p className="mt-4 text-slate-600">
            Cuéntanos qué necesitas y te contactamos en menos de 24 horas.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Tu nombre"
                  className="mt-2 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="colegio">Colegio</Label>
                <Input
                  id="colegio"
                  placeholder="Nombre del colegio"
                  className="mt-2 bg-white"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  className="mt-2 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="+51 999 999 999"
                  className="mt-2 bg-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                placeholder="Cuéntanos sobre tu institución..."
                className="mt-2 min-h-32 bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              Enviar mensaje
            </Button>
          </form>

          <div className="space-y-6">
            <div className="rounded-2xl bg-purple-600 p-8 text-white">
              <h3 className="text-2xl font-bold">Soporte dedicado</h3>
              <p className="mt-2 text-purple-100">
                Nuestro equipo está listo para ayudarte de lunes a sábado.
              </p>
            </div>
            {[
              { icon: Mail, title: "Correo", value: "contacto@edugestion.pe" },
              { icon: Phone, title: "Teléfono", value: "+51 1 555 0100" },
              {
                icon: MapPin,
                title: "Oficina",
                value: "Av. Javier Prado 1234, Lima, Perú",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {c.title}
                  </p>
                  <p className="text-sm text-slate-600">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function FinalCTA() {
  return (
    <section className="bg-purple-600 py-20 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          ¿Listo para transformar tu colegio?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">
          Únete a las instituciones que ya digitalizaron su gestión con
          EduGestión.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {/* Botón blanco forzado */}
          <Button
            size="lg"
            className="!bg-white !text-purple-600 hover:!bg-slate-100 border-none font-semibold shadow-md"
          >
            Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {/* Botón delineado en blanco */}
          <Button
            size="lg"
            variant="outline"
            className="border-white !bg-transparent !text-white hover:!bg-white/20"
          >
            Agendar una Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  const cols = [
    {
      title: "Producto",
      links: ["Módulos", "Precios", "Roles", "Demo"],
    },
    {
      title: "Empresa",
      links: ["Nosotros", "Blog", "Casos de éxito", "Contacto"],
    },
    {
      title: "Recursos",
      links: ["Documentación", "Centro de ayuda", "Comunidad", "Estado"],
    },
    {
      title: "Legal",
      links: ["Términos", "Privacidad", "Cookies", "Seguridad"],
    },
  ];
  return (
    <footer className="bg-slate-900 py-16 text-slate-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">EduGestión</span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Gestión educativa inteligente y centralizada para colegios
              modernos.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-white">{c.title}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-purple-400"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} EduGestión. Todos los derechos
            reservados.
          </p>
          <p>Hecho con dedicación en Perú.</p>
        </div>
      </div>
    </footer>
  );
}
export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Modules />
        <RolesSection />
        <Pricing />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
