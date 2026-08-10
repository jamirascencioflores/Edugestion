import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para la bandera de Autenticación de Doble Factor (2FA)
  const [is2FAEnabled, setIs2FAEnabled] = useState(() => {
    return localStorage.getItem("user_2fa_enabled") === "true";
  });

  // Inicialización síncrona: Lee el localStorage al momento de crear el estado
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Validación de seguridad: Comprobar si el token ya expiró
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn("Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("jwt_token");
          return null;
        }

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
      setUser(decoded);
    } catch (error) {
      console.error("Error al decodificar token en login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };

  // Función para alternar el 2FA y guardar su estado
  const toggle2FA = (enabled) => {
    setIs2FAEnabled(enabled);
    localStorage.setItem("user_2fa_enabled", enabled ? "true" : "false");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        is2FAEnabled,
        toggle2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
