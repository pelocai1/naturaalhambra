// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useContext(AuthContext);

  // Si no hay usuario, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si es una ruta solo para admin y no es admin, redirige al home
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza el componente hijo
  return children;
}

export default ProtectedRoute;
