import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    user: "",
    house: "",
    startDate: "",
    endDate: "",
  });

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

  const handleFilter = async () => {
    try {
      const res = await api.post("/reservations/admin/filter", filters);
      setReservations(res.data.reservations || []);
    } catch {
      setMessage("Error al filtrar reservas");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div
      className="mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h4 className="mb-4">Reservas registradas</h4>

      <div
        className="card p-4 shadow-sm mb-4"
        style={{ backgroundColor: "#e9f5e1" }}
      >
        <h5 className="mb-3">Filtrar reservas</h5>
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Casa"
              value={filters.house}
              onChange={(e) =>
                setFilters({ ...filters, house: e.target.value })
              }
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="date"
              className="form-control"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="date"
              className="form-control"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={handleFilter}>
            Buscar
          </button>
        </div>
      </div>

      <div className="mb-4">
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

      <div className="row">
        {reservations.map((r) => (
          <div key={r.id} className="col-md-6 mb-4">
            <div
              className="card shadow-sm h-100 rounded-3 border-0"
              style={{ backgroundColor: "#e9f5e1" }}
            >
              <div className="card-body">
                <h5 className="card-title">{r.House?.name}</h5>
                <h6 className="card-subtitle mb-3 text-muted">
                  {r.User?.name} – {r.User?.email}
                </h6>

                <div className="mb-3">
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

                <div className="mb-3">
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

                <div className="mb-2">
                  <label className="form-label">Estado:</label>
                  <select
                    className="form-select"
                    value={r.status}
                    onChange={(e) =>
                      handleUpdate(r.id, "status", e.target.value)
                    }
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
    </div>
  );
}

export default AdminReservations;
