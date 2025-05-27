import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaMapMarkedAlt, FaHeadset, FaPaw } from 'react-icons/fa'; // Agregamos FaPaw
import alhambraBg from '../assets/fondo.png';

function Home() {
  console.log('🏠 Componente Home renderizado');

  return (
    <>
      {/* HERO principal */}
      <div
        className="text-white d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 49, 34, 0.5), rgba(34, 49, 34, 0.5)), url(${alhambraBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '70vh',
          paddingTop: '4rem',
          paddingBottom: '4rem'
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold">Natura Alhambra</h1>
          <p className="lead mb-4">Casas rurales con encanto en Granada. Descansa, disfruta y desconecta.</p>
          <Link to="/houses" className="btn btn-light btn-lg shadow-sm">
            Explorar casas
          </Link>
        </div>
      </div>

      {/* Beneficios */}
      <div className="container my-5">
        <div className="row text-center">
          <div className="col-md-3">
            <FaBed size={40} className="mb-3" />
            <h5>Comodidad asegurada</h5>
            <p>Casas totalmente equipadas para tu descanso.</p>
          </div>
          <div className="col-md-3">
            <FaMapMarkedAlt size={40} className="mb-3" />
            <h5>Ubicación perfecta</h5>
            <p>En el corazón de Granada y Sierra Nevada.</p>
          </div>
          <div className="col-md-3">
            <FaHeadset size={40} className="mb-3" />
            <h5>Atención personalizada</h5>
            <p>Estamos disponibles para ayudarte en todo momento.</p>
          </div>
          <div className="col-md-3">
            <FaPaw size={40} className="mb-3" />
            <h5>Pet Friendly</h5>
            <p>¡Tus mascotas son bienvenidas en nuestras casas rurales!</p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-success text-white text-center py-5">
        <h4>¿Tienes preguntas?</h4>
        <p>Contáctanos y estaremos encantados de ayudarte.</p>
        <Link to="/contact" className="btn btn-outline-light">Ir a contacto</Link>
      </div>
    </>
  );
}

export default Home;
