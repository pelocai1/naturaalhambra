import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Si aún no sabemos si hay usuario (contexto cargando)
  if (user === null && localStorage.getItem('token')) {
    return <p>Cargando...</p>; // Espera antes de redirigir
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}


export default PrivateRoute;
