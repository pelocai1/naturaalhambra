import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function UserReservations() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await api.get(`/reservations/user/${user.id}`);
      setReservations(res.data.reservations);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar tus reservas");
    }
  };

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleCancel = async (id) => {
    try {
      await api.put(`/reservations/${id}/cancel`);
      setSuccess("Reserva cancelada con éxito");
      setError("");
      fetchReservations();
    } catch {
      setError("Error al cancelar la reserva");
      setSuccess("");
    }
  };

  const handlePayment = async (id) => {
    try {
      await api.post(`/reservations/pagar/${id}`);
      setSuccess(
        "Pago realizado con éxito. Revisa tu correo para ver el código de acceso."
      );
      setError("");
      fetchReservations(); // Actualiza el estado a "confirmed"
    } catch (err) {
      setError("Error al procesar el pago");
      setSuccess("");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mis Reservas</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {reservations.length === 0 ? (
        <p>No tienes reservas registradas.</p>
      ) : (
        <div className="list-group">
          {reservations.map((r) => (
            <div key={r.id} className="list-group-item mb-3 shadow-sm rounded">
              <h5 className="mb-1">{r.House?.name}</h5>
              <p className="mb-1">{r.House?.location}</p>
              <p className="mb-1">
                <strong>Del:</strong>{" "}
                {new Date(r.startDate).toLocaleDateString()}
                <br />
                <strong>Al:</strong> {new Date(r.endDate).toLocaleDateString()}
              </p>
              <p className="mb-1">
                <strong>Estado:</strong> {r.status}
              </p>

              {r.status === "pending" && new Date(r.startDate) > new Date() && (
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handlePayment(r.id)}
                  >
                    Pagar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleCancel(r.id)}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserReservations;
