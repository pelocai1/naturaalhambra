import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-3 mb-md-0">
          <strong>Natura Alhambra</strong> &copy; {new Date().getFullYear()}
        </div>

        <div className="mb-3 mb-md-0">
          <a href="/about" className="text-light me-3">Sobre nosotros</a>
          <a href="/privacy" className="text-light me-3">Privacidad</a>
          <a href="/terms" className="text-light">Términos</a>
        </div>

        <div>
          <a href="https://facebook.com" className="text-light me-3" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" className="text-light me-3" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" className="text-light me-3" target="_blank" rel="noopener noreferrer">
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
