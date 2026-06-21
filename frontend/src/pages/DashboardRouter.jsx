import { useAuth } from "../context/AuthContext";
// Importamos los dashboards de cada rol
import DashboardSuperAdmin from "./SuperAdmin/index"; // o como lo hayas llamado
import DashboardDirector from "./Director/index"; // Descomenta cuando lo crees
import DashboardDocente from "./Docentes/index";

export default function Dashboard() {
  const { user } = useAuth();

  // Limpiamos el rol por si viene como "ROLE_SUPERADMIN"
  const rolUsuario = user?.rol?.replace("ROLE_", "") || "";

  // El "Interruptor Inteligente"
  if (rolUsuario === "SUPERADMIN") {
    return <DashboardSuperAdmin />;
  }

  if (rolUsuario === "ADMIN_COLEGIO") {
    return <DashboardDirector />;
  }

  if (rolUsuario === "DOCENTE") {
    return <DashboardDocente />;
  }

  // Fallback por si acaso
  return (
    <div className="p-8 text-center text-slate-500">
      <h2 className="text-2xl font-bold">Cargando tu espacio...</h2>
    </div>
  );
}
