// src/components/BodyClassController.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BodyClassController = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.className = ''; // limpia clases previas

    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/contact') {
      document.body.classList.add('auth-background');
    } else {
      document.body.classList.add('default-background');
    }
  }, [location.pathname]);

  return null; // este componente no renderiza nada
};

export default BodyClassController;
