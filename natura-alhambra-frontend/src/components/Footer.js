import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5 border-top">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
        <div className="mb-3 mb-md-0 fw-bold">
          Natura Alhambra &copy; {new Date().getFullYear()}
        </div>

        <div className="mb-3 mb-md-0 d-flex flex-column flex-md-row gap-3">
          <a href="/about" className="text-light text-decoration-none">
            Sobre nosotros
          </a>
          <a href="/privacy" className="text-light text-decoration-none">
            Privacidad
          </a>
          <a href="/terms" className="text-light text-decoration-none">
            Términos
          </a>
        </div>

        <div className="d-flex gap-3 fs-5">
          <a
            href="https://facebook.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            className="text-light"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
          <a href="mailto:contacto@natura-alhambra.com" className="text-light">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
