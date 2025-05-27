import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ Estado de carga
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwt_decode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        logout(false); // 👇 No navegar si ya estamos cargando
      } else {
        const decoded = jwt_decode(token);
        setUser(decoded);
      }
    }
    setLoading(false); // 🔚 Terminó la verificación
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwt_decode(token);
    setUser(decoded);
  };

  const logout = (shouldNavigate = true) => {
    localStorage.removeItem("token");
    setUser(null);
    if (shouldNavigate) {
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
