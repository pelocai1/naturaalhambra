import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await api.get("/admin/reservations");
      setReservations(res.data.reservations || []);
    } catch {
      setReservations([]);
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await api.put(`/admin/reservations/${id}`, { [field]: value });
      fetchReservations();
      setMessage("Reserva actualizada con éxito");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Error al actualizar la reserva");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
      <h4 className="mb-4">Reservas registradas</h4>
      <div className="mb-3">
        <button
          className="btn btn-danger"
          onClick={async () => {
            try {
              const confirm = window.confirm(
                "¿Eliminar todas las reservas canceladas no confirmadas?"
              );
              if (!confirm) return;
              const res = await api.delete(
                "/reservations/admin/clean-cancelled"
              );
              setMessage(res.data.message);
              fetchReservations();
            } catch {
              setMessage("Error al eliminar reservas canceladas");
            } finally {
              setTimeout(() => setMessage(""), 3000);
            }
          }}
        >
          Eliminar reservas canceladas sin confirmar
        </button>
      </div>
      {message && <div className="alert alert-info">{message}</div>}

      {reservations.map((r) => (
        <div key={r.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{r.House?.name}</h5>
            <h6 className="card-subtitle text-muted mb-2">
              {r.User?.name} – {r.User?.email}
            </h6>

            <div className="row">
              <div className="col-md-4 mb-2">
                <label className="form-label">Fecha de inicio:</label>
                <input
                  type="date"
                  className="form-control"
                  value={r.startDate.split("T")[0]}
                  onChange={(e) =>
                    handleUpdate(r.id, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="col-md-4 mb-2">
                <label className="form-label">Fecha de fin:</label>
                <input
                  type="date"
                  className="form-control"
                  value={r.endDate.split("T")[0]}
                  onChange={(e) =>
                    handleUpdate(r.id, "endDate", e.target.value)
                  }
                />
              </div>
              <div className="col-md-4 mb-2">
                <label className="form-label">Estado:</label>
                <select
                  className="form-select"
                  value={r.status}
                  onChange={(e) => handleUpdate(r.id, "status", e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminReservations;
