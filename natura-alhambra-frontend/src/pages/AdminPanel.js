import React, { useState } from 'react';
import AdminHouses from './admin/AdminHouses';
import AdminReservations from './admin/AdminReservations';
import AdminUsers from './admin/AdminUsers';

function AdminPanel() {
  const [section, setSection] = useState('houses');

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>

      <div className="btn-group mt-3 mb-4" role="group">
        <button
          className={`btn btn-outline-primary ${section === 'houses' ? 'active' : ''}`}
          onClick={() => setSection('houses')}
        >
          Casas
        </button>
        <button
          className={`btn btn-outline-primary ${section === 'reservations' ? 'active' : ''}`}
          onClick={() => setSection('reservations')}
        >
          Reservas
        </button>
        <button
          className={`btn btn-outline-primary ${section === 'users' ? 'active' : ''}`}
          onClick={() => setSection('users')}
        >
          Usuarios
        </button>
      </div>

      {section === 'houses' && <AdminHouses />}
      {section === 'reservations' && <AdminReservations />}
      {section === 'users' && <AdminUsers />}
    </div>
  );
}

export default AdminPanel;
