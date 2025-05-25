import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/soloLogo.png'; // Ajusta ruta según ubicación real

function Home() {
  return (
    <div className="container text-center mt-5">
      <img
        src={logo}
        alt="Natura Alhambra logo"
        className="mb-4"
        style={{ maxWidth: '300px' }}
      />

      <h1 className="text-success mb-3" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
        Natura Alhambra
      </h1>
      <p className="text-muted mb-4" style={{ letterSpacing: '2px' }}>
        VIVE GRANADA
      </p>

      <p className="lead">
        Encuentra tu casa rural perfecta en plena naturaleza.  
        Relájate, explora y desconecta en los rincones más auténticos de Granada.
      </p>

      <Link to="/houses" className="btn btn-outline-success btn-lg mt-3">
        Ver casas disponibles
      </Link>
    </div>
  );
}

export default Home;
