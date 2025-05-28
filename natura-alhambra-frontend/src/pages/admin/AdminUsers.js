import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await api.put(`/admin/users/${id}`, { [field]: value });
      fetchUsers();
      setMessage("Usuario actualizado");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Error al actualizar usuario");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mt-4">
      <h4 className="mb-4">Usuarios registrados</h4>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {users.map((u) => (
          <div key={u.id} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="mb-3">
                  <h5 className="card-title mb-1">{u.name}</h5>
                  <p className="text-muted mb-2">{u.email}</p>
                  <p className="mb-0">
                    <strong>Rol:</strong> {u.role} <br />
                    <strong>Estado:</strong>{" "}
                    <span className={u.active ? "text-success" : "text-danger"}>
                      {u.active ? "Activo" : "Inactivo"}
                    </span>
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-sm"
                    value={u.role}
                    onChange={(e) => handleUpdate(u.id, "role", e.target.value)}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <button
                    className={`btn btn-sm ${
                      u.active ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() => handleUpdate(u.id, "active", !u.active)}
                  >
                    {u.active ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;
