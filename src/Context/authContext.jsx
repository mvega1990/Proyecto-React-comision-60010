import { createContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // El login viaja en una cookie httpOnly (no se puede leer desde JS), así
  // que la única forma de saber "¿hay sesión activa?" es preguntarle al
  // backend. Esto se llama al arrancar la app y después de cada login/logout.
  const fetchCurrentUser = () => {
    return fetch(`${API_URL}/api/session/current`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          setUser(null);
          return;
        }
        return res.json().then((data) => setUser(data.user.user));
      })
      .catch(() => setUser(null));
  };

  useEffect(() => {
    fetchCurrentUser().finally(() => setLoadingAuth(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/session/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo iniciar sesión");
    await fetchCurrentUser();
  };

  const register = async ({ first_name, last_name, age, email, password }) => {
    const res = await fetch(`${API_URL}/api/session/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ first_name, last_name, age, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo registrar");
    // El registro no inicia sesión solo, así que logueamos con las mismas
    // credenciales para no hacerle escribir todo dos veces al usuario.
    await login(email, password);
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/session/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
