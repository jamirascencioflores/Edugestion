import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicialización síncrona: Lee el localStorage al momento de crear el estado
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Validación de seguridad: Comprobar si el token ya expiró
        // (decoded.exp está en segundos, Date.now() en milisegundos)
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn("Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("jwt_token");
          return null;
        }

        // El objeto decoded ahora contiene: email, userId, nombre, rol y colegioId
        return decoded;
      } catch {
        localStorage.removeItem("jwt_token");
        return null;
      }
    }
    return null;
  });

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem("jwt_token", token);
      setUser(decoded); // Esto debe disparar el re-render de las rutas protegidas
    } catch (error) {
      console.error("Error al decodificar token en login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Deshabilitamos la advertencia de Vite solo para esta línea,
// ya que es el estándar en la comunidad exportar el hook desde el mismo archivo.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
