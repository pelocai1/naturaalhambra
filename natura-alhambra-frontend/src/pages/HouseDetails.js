import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function HouseDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [house, setHouse] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservationMessage, setReservationMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [reservedDates, setReservedDates] = useState([]);

  const formatDateLocal = (date) => {
    const adjusted = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return adjusted.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resHouse = await api.get(`/houses/${id}`);
        setHouse(resHouse.data.data);

        const resComments = await api.get(`/comments/house/${id}`);
        setComments(resComments.data.comments || []);

        const resRating = await api.get(`/comments/house/${id}/rating`);
        setRating(resRating.data.averageRating);

        const resReservations = await api.get(`/reservations/house/${id}`);
        setReservedDates(resReservations.data.reservations || []);
      } catch {
        setReservationMessage("Error al cargar los datos de la casa.");
      }
    };

    fetchData();
  }, [id]);

  const excludedIntervals = reservedDates.map((r) => {
    const start = new Date(r.startDate);
    const end = new Date(r.endDate);
    return {
      start: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
      end: new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
        999
      ),
    };
  });

  const isDateAvailable = (date) => {
    return !reservedDates.some((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return date >= start && date <= end;
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/comments", {
        userId: user.id,
        houseId: id,
        comment: newComment,
        rating: newRating,
      });
      setNewComment("");
      setNewRating(5);
      setSubmitMessage("Comentario enviado con éxito");
      const res = await api.get(`/comments/house/${id}`);
      setComments(res.data.comments || []);
    } catch {
      setSubmitMessage("Error al enviar comentario");
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setReservationMessage("");

    if (!startDate || !endDate || startDate >= endDate) {
      setReservationMessage("Las fechas seleccionadas no son válidas.");
      return;
    }

    try {
      const check = await api.get("/reservations/check", {
        params: {
          houseId: id,
          startDate: formatDateLocal(startDate),
          endDate: formatDateLocal(endDate),
        },
      });

      if (!check.data.available) {
        setReservationMessage("Las fechas seleccionadas ya están ocupadas.");
        return;
      }

      await api.post("/reservations", {
        userId: user.id,
        houseId: id,
        startDate: formatDateLocal(startDate),
        endDate: formatDateLocal(endDate),
      });

      setReservationMessage("Reserva realizada con éxito");
      setStartDate(null);
      setEndDate(null);
    } catch {
      setReservationMessage("Error al realizar la reserva");
    }
  };

  if (!house) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <h2>{house.name}</h2>
      {house.imageUrl && (
        <img
          src={house.imageUrl}
          alt={house.name}
          className="img-fluid rounded-4 shadow mb-4"
          style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
        />
      )}
      <p className="text-muted">{house.location}</p>
      <p>{house.description}</p>
      <p>
        <strong>Precio:</strong> {house.price} € / noche
      </p>
      <p>
        <strong>Capacidad:</strong> {house.capacity} personas
      </p>
      <p>
        <strong>Disponible:</strong> {house.availability ? "Sí" : "No"}
      </p>

      <hr />

      <h4>Valoración</h4>
      <p>{rating ? `⭐ ${rating} / 5` : "Sin valoraciones aún"}</p>

      <h4 className="mt-4">Comentarios</h4>
      {comments.length > 0 ? (
        <div className="row mb-4">
          {comments.map((c) => (
            <div key={c.id} className="col-md-6 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <p className="card-text">
                    <strong>{c.rating} ⭐</strong> – {c.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay comentarios aún.</p>
      )}

      {user && (
        <>
          <h4>Deja tu comentario</h4>
          <form
            onSubmit={handleCommentSubmit}
            className="mb-4"
            style={{ maxWidth: "600px" }}
          >
            <div className="mb-2">
              <label className="form-label">Valoración:</label>
              <select
                className="form-select"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Comentario:</label>
              <textarea
                className="form-control"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              ></textarea>
            </div>
            {submitMessage && (
              <div className="alert alert-info">{submitMessage}</div>
            )}
            <button className="btn btn-custom">Enviar comentario</button>
          </form>

          <h4>Fechas ocupadas</h4>
          {reservedDates.length === 0 ? (
            <p>No hay reservas actualmente.</p>
          ) : (
            <div className="row mb-3">
              {reservedDates.map((r, i) => (
                <div key={i} className="col-md-6 mb-2">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      Del {formatDateLocal(new Date(r.startDate))} al{" "}
                      {formatDateLocal(new Date(r.endDate))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h4>Reservar esta casa</h4>
          <form
            onSubmit={handleReservationSubmit}
            style={{ maxWidth: "600px" }}
          >
            <div className="mb-3">
              <label className="form-label">Fecha de entrada:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                excludeDateIntervals={excludedIntervals}
                filterDate={isDateAvailable}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha de salida:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                excludeDateIntervals={excludedIntervals}
                filterDate={isDateAvailable}
              />
            </div>
            {reservationMessage && (
              <div className="alert alert-info">{reservationMessage}</div>
            )}
            <button type="submit" className="btn btn-custom">
              Reservar
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default HouseDetails;
