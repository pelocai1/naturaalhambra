import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import alhambraBg from "../assets/fondo.png";
import imgComodidad from "../assets/comodidad.jpg";
import imgUbicacion from "../assets/ubicacion.jpg";
import imgMascotas from "../assets/mascotas.jpg";
import imgAtencion from "../assets/acceso.jpg";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });

    // 🔧 Fuerza recálculo al terminar el render
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }, []);

  return (
    <>
      {/* HERO principal */}
      <div
        className="text-white d-flex align-items-center justify-content-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(12, 29, 30, 0.7), rgba(12, 29, 30, 0.7)), url(${alhambraBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "90vh",
          paddingTop: "6rem",
          paddingBottom: "6rem",
          marginBottom: "6rem",
        }}
      >
        <div className="container">
          <h1 className="display-2 fw-bold">NATURA ALHAMBRA</h1>

          <p
            className="lead mb-4"
            style={{ backgroundColor: "transparent", color: "white" }}
          >
            VIVE GRANADA · Casas rurales con encanto · Naturaleza y descanso
          </p>
          <Link to="/houses" className="btn btn-custom btn-lg shadow">
            Explorar casas
          </Link>
        </div>
      </div>
      {/* SECCIÓN 1: Comodidad */}
      <div className="container py-6" style={{ marginBottom: "6rem" }}>
        <div className="row align-items-center">
          <div
            className="col-md-6"
            data-aos="fade-right"
            data-aos-offset="100"
            data-aos-anchor-placement="top-center"
          >
            <img
              src={imgComodidad}
              alt="Comodidad"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div
            className="col-md-6"
            data-aos="fade-left"
            data-aos-offset="50"
            data-aos-anchor-placement="top-center"
          >
            <h2>Comodidad asegurada</h2>
            <p>
              Todas nuestras casas están equipadas con camas de calidad, cocinas
              completas y espacios diseñados para tu descanso.
            </p>
          </div>
        </div>
      </div>
      {/* SECCIÓN 2: Ubicación */}
      <div className="container py-6" style={{ marginBottom: "6rem" }}>
        <div className="row align-items-center flex-md-row-reverse">
          <div
            className="col-md-6"
            data-aos="fade-left"
            data-aos-offset="100"
            data-aos-anchor-placement="top-center"
          >
            <img
              src={imgUbicacion}
              alt="Ubicación"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div
            className="col-md-6"
            data-aos="fade-right"
            data-aos-offset="50"
            data-aos-anchor-placement="top-center"
          >
            <h2>Ubicación privilegiada</h2>
            <p>
              A un paso de la Alhambra y Sierra Nevada, descubre lo mejor de
              Granada desde un entorno rural único.
            </p>
          </div>
        </div>
      </div>
      {/* SECCIÓN 3: Pet Friendly */}
      <div className="container py-6" style={{ marginBottom: "6rem" }}>
        <div className="row align-items-center">
          <div
            className="col-md-6"
            data-aos="fade-right"
            data-aos-offset="100"
            data-aos-anchor-placement="top-center"
          >
            <img
              src={imgMascotas}
              alt="Pet friendly"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div
            className="col-md-6"
            data-aos="fade-left"
            data-aos-offset="50"
            data-aos-anchor-placement="top-center"
          >
            <h2>Pet Friendly</h2>
            <p>
              Trae a tus mascotas contigo. En Natura Alhambra, todos los
              miembros de la familia son bienvenidos.
            </p>
          </div>
        </div>
      </div>
      {/* SECCIÓN 4: Acceso autónomo y seguro */}
      <div className="container py-6" style={{ marginBottom: "6rem" }}>
        <div className="row align-items-center flex-md-row-reverse">
          <div
            className="col-md-6"
            data-aos="fade-left"
            data-aos-offset="100"
            data-aos-anchor-placement="top-center"
          >
            <img
              src={imgAtencion}
              alt="Acceso"
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div
            className="col-md-6"
            data-aos="fade-right"
            data-aos-offset="50"
            data-aos-anchor-placement="top-center"
          >
            <h2>Acceso autónomo y seguro</h2>
            <p>
              Una vez confirmada tu reserva, recibirás un código personalizado
              para acceder a tu casa sin esperas ni llaves físicas. Total
              libertad, máxima comodidad.
            </p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-dark text-white text-center py-5">
        <h4>¿Tienes preguntas?</h4>
        <p style={{ backgroundColor: "transparent", color: "white" }}>
          Contáctanos y estaremos encantados de ayudarte.
        </p>
        <Link to="/contact" className="btn btn-outline-light mt-3">
          Ir a contacto
        </Link>
      </div>
    </>
  );
}

export default Home;
