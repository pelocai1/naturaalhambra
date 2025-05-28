import React, { useEffect, useRef, useState } from "react";
import api from "../../services/api";

function AdminHouses() {
  const [houses, setHouses] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    capacity: "",
    image: null,
  });
  const [editingHouse, setEditingHouse] = useState(null);
  const imageRef = useRef();

  const fetchHouses = async () => {
    try {
      const res = await api.get("/admin/houses");
      const list = res.data.houses ?? res.data.data ?? res.data;
      setHouses(Array.isArray(list) ? list : []);
    } catch {
      setHouses([]);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      if (editingHouse) {
        await api.put(`/admin/houses/${editingHouse.id}`, data);
        setMessage("Casa actualizada");
      } else {
        await api.post("/admin/houses", data);
        setMessage("Casa creada");
      }

      setForm({
        name: "",
        location: "",
        description: "",
        price: "",
        capacity: "",
        image: null,
      });
      setEditingHouse(null);
      fetchHouses();

      if (imageRef.current) {
        imageRef.current.value = "";
      }
    } catch {
      setMessage("Error al guardar la casa");
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await api.put(`/admin/houses/${id}/toggle`);
      fetchHouses();
    } catch {
      setMessage("Error al cambiar disponibilidad");
    }
  };

  const handleEdit = (house) => {
    setEditingHouse(house);
    setForm({
      name: house.name,
      location: house.location,
      description: house.description,
      price: house.price,
      capacity: house.capacity,
      image: null,
    });
    if (imageRef.current) imageRef.current.value = "";
  };

  return (
    <div
      className="mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h4 className="mb-4">Casas registradas</h4>

      <div className="row">
        {houses.map((house) => (
          <div key={house.id} className="col-md-6 mb-4">
            <div
              className="card h-100 shadow-sm border-0"
              style={{ backgroundColor: "#e9f5e1" }}
            >
              <div className="card-body">
                <h5 className="card-title">{house.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {house.location}
                </h6>
                <p className="card-text">{house.description}</p>
                <p className="card-text">
                  <strong>Capacidad:</strong> {house.capacity} |{" "}
                  <strong>Precio:</strong> {house.price} €
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${
                      house.availability ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {house.availability ? "Activa" : "Inactiva"}
                  </span>
                  <div>
                    <button
                      onClick={() => toggleAvailability(house.id)}
                      className="btn btn-sm btn-outline-warning me-2"
                    >
                      Cambiar
                    </button>
                    <button
                      onClick={() => handleEdit(house)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-5" />

      <h5 className="mb-3">
        {editingHouse ? "Editar casa" : "Añadir nueva casa"}
      </h5>
      {message && <div className="alert alert-info">{message}</div>}

      <div
        className="card p-4 shadow-sm mb-5 border-0"
        style={{ maxWidth: "600px", backgroundColor: "#e9f5e1" }}
      >
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="name"
            className="form-control mb-3"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            className="form-control mb-3"
            placeholder="Ubicación"
            value={form.location}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            className="form-control mb-3"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            className="form-control mb-3"
            placeholder="Precio por noche"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="capacity"
            className="form-control mb-3"
            placeholder="Capacidad (personas)"
            value={form.capacity}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            className="form-control mb-3"
            onChange={handleChange}
            accept="image/*"
            ref={imageRef}
          />
          <button className="btn btn-success">
            {editingHouse ? "Guardar cambios" : "Crear casa"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminHouses;
