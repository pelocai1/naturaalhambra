import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await api.put(`/admin/users/${id}`, { [field]: value });
      fetchUsers();
      setMessage('Usuario actualizado');
    } catch {
      setMessage('Error al actualizar usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h4>Usuarios registrados</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <ul className="list-group">
        {users.map((u) => (
          <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{u.name}</strong> – {u.email}<br />
              Rol: {u.role} | Estado: {u.active ? 'Activo' : 'Inactivo'}
            </div>
            <div>
              <select
                className="form-select form-select-sm me-2"
                value={u.role}
                onChange={(e) => handleUpdate(u.id, 'role', e.target.value)}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <button
                className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                onClick={() => handleUpdate(u.id, 'active', !u.active)}
              >
                {u.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;
