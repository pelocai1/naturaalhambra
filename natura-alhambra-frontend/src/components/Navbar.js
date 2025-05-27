import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/soloLogo.png'; // Verifica que el logo esté en esta ruta

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} alt="Logo" width="40" height="40" className="me-2" />
        <span className="fw-bold fs-5">Natura Alhambra</span>
      </Link>

      <div className="ms-auto">
        <ul className="navbar-nav d-flex align-items-center">
          {/* Inicio para todos */}
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>

          {/* Casas solo para usuarios normales o no logueados */}
          {(!user || user.role === 'user') && (
            <li className="nav-item">
              <Link className="nav-link" to="/houses">Casas</Link>
            </li>
          )}

          {/* Panel admin solo para admin */}
          {user?.role === 'admin' && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Panel Admin</Link>
            </li>
          )}

          {/* Reservas y Contacto solo para usuarios */}
          {user?.role === 'user' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/reservations">Mis reservas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contáctanos</Link>
              </li>
            </>
          )}

          {/* Autenticación */}
          {user ? (
            <li className="nav-item">
              <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Iniciar sesión</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
