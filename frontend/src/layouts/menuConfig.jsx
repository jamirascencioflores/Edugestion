import {
  LayoutDashboard,
  School,
  Users,
  CreditCard,
  ShieldCheck,
  Settings,
  BookOpen,
  Award,
  Layers,
  Library,
  Network,
  GraduationCap,
  Wallet,
  Megaphone, // <--- Nuevo ícono importado para los anuncios
} from "lucide-react";

// --- MENÚS SUPERADMIN ---
export const menuSuperAdmin = [
  {
    name: "Dashboard General",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { name: "Colegios", path: "/colegios", icon: <School size={20} /> },
  {
    name: "Planes y Pagos", // <--- Fusionado y renombrado
    path: "/planes",
    icon: <CreditCard size={20} />,
  },
];

export const menuSuperAdminSistema = [
  {
    name: "Anuncios Globales",
    path: "/anuncios-globales",
    icon: <Megaphone size={20} />,
  },
  {
    name: "Seguridad",
    path: "/seguridad",
    icon: <ShieldCheck size={20} />,
  },
  {
    name: "Configuración",
    path: "/configuracion",
    icon: <Settings size={20} />,
  },
];

// --- MENÚS DIRECTOR ---
export const menuDirector = [
  {
    name: "Mi Colegio",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { name: "Personal Docente", path: "/docentes", icon: <Users size={20} /> },
  {
    name: "Estudiantes",
    path: "/estudiantes",
    icon: <GraduationCap size={20} />,
  },
  { name: "Periodos", path: "/periodos", icon: <BookOpen size={20} /> },
  {
    name: "Grados y Secciones",
    path: "/grados-secciones",
    icon: <Layers size={20} />,
  },
  {
    name: "Cursos",
    path: "/cursos",
    icon: <Library size={20} />,
  },
  {
    name: "Malla Curricular",
    path: "/malla-curricular",
    icon: <Network size={20} />,
  },
  {
    name: "Tarifarios",
    path: "/tarifarios",
    icon: <Wallet size={20} />,
  },
  {
    name: "Caja",
    path: "/caja",
    icon: <CreditCard size={20} />,
  },
];

// --- MENÚS DOCENTE ---
export const menuDocente = [
  {
    name: "Mis Clases",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Calificaciones",
    path: "/calificaciones",
    icon: <Award size={20} />,
  },
  { name: "Materiales", path: "/materiales", icon: <BookOpen size={20} /> },
];

// --- MENÚS SISTEMA (ADMIN_COLEGIO) ---
export const menuSistema = [
  {
    name: "Configuración",
    path: "/configuracion",
    icon: <Settings size={20} />,
  },
  { name: "Seguridad", path: "/seguridad", icon: <ShieldCheck size={20} /> },
];


