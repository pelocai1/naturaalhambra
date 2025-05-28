import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Houses() {
  const [houses, setHouses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState("");

  const [maxPrice, setMaxPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [availableLocations, setAvailableLocations] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await api.get("/houses");
        const allHouses = res.data.data || [];
        setHouses(allHouses);
        setFiltered(allHouses);

        const locations = [...new Set(allHouses.map((h) => h.location))];
        setAvailableLocations(locations);
      } catch {
        setError("No se pudieron cargar las casas.");
      }
    };
    fetchHouses();
  }, []);

  const handleFilter = async () => {
    try {
      const filters = {};
      if (maxPrice) filters.maxPrice = maxPrice;
      if (location) filters.location = location;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (capacity) filters.capacity = capacity;

      const res = await api.get("/houses", { params: filters });
      setFiltered(res.data.data || []);
    } catch {
      setFiltered([]);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-5 text-center">Casas disponibles</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Barra lateral */}
        <div className="col-md-3 mb-4">
          <div className="card p-4 shadow-sm card-modern">
            <h5 className="mb-4">Filtrar</h5>

            <div className="mb-3">
              <label className="form-label">Precio máximo (€)</label>
              <select
                className="form-select"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="50">Hasta 50 €</option>
                <option value="100">Hasta 100 €</option>
                <option value="150">Hasta 150 €</option>
                <option value="200">Hasta 200 €</option>
                <option value="300">Hasta 300 €</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Capacidad mínima</label>
              <input
                type="number"
                className="form-control"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Ej: 4"
                min={1}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ubicación</label>
              <select
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Todas</option>
                {availableLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha entrada</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha salida</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button className="btn btn-custom w-100" onClick={handleFilter}>
              Aplicar filtros
            </button>
          </div>
        </div>

        {/* Listado de casas */}
        <div className="col-md-9">
          <div className="row">
            {filtered.length === 0 ? (
              <p>No hay casas que cumplan con los filtros seleccionados.</p>
            ) : (
              filtered.map((house) => (
                <div className="col-md-6 mb-4" key={house.id}>
                  <div className="card h-100 shadow-sm card-modern">
                    {house.imageUrl && (
                      <img
                        src={house.imageUrl}
                        alt={house.name}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{house.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {house.location}
                      </h6>
                      <p className="card-text flex-grow-1">
                        {house.description}
                      </p>
                      <p>
                        <strong>{house.price} €</strong> por noche
                      </p>
                      <p>
                        <strong>Capacidad:</strong> {house.capacity} personas
                      </p>
                      <Link
                        to={`/houses/${house.id}`}
                        className="btn btn-custom mt-auto"
                      >
                        Ver más
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Houses;
