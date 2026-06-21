import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 1. Si no hay usuario
  if (!user) {
    console.warn("Bloqueado: No hay usuario en sesión. Redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay restricción de roles
  if (allowedRoles && allowedRoles.length > 0) {
    // DEBUG: Ver qué trae tu token realmente
    console.log("Token decodificado:", user);

    // Extraemos los roles de forma segura (soporta string o array, 'rol' o 'roles')
    let rolesDelUsuario = user.roles || user.rol || user.authorities || [];
    if (!Array.isArray(rolesDelUsuario)) {
      rolesDelUsuario = [rolesDelUsuario]; // Si es un string, lo hacemos array
    }

    // Verificamos si alguno de sus roles coincide con los permitidos
    const tienePermiso = rolesDelUsuario.some((r) => {
      const cleanRole =
        typeof r === "string"
          ? r.replace("ROLE_", "")
          : r.authority?.replace("ROLE_", "");
      return allowedRoles.includes(cleanRole);
    });

    if (!tienePermiso) {
      console.warn("Bloqueado: Rol insuficiente. Redirigiendo a /dashboard");
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Pasa todas las validaciones
  return children;
}
