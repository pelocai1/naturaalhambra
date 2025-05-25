import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';

function AdminHouses() {
  const [houses, setHouses] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    capacity: '',
    image: null
  });
  const [editingHouse, setEditingHouse] = useState(null);
  const imageRef = useRef(); // Referencia para el input de imagen

  const fetchHouses = async () => {
    try {
      const res = await api.get('/admin/houses');
      const list = res.data.houses ?? res.data.data ?? res.data;   // admite ambos formatos
                    setHouses(Array.isArray(list) ? list : []);
    } catch {
      setHouses([]);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    try {
      if (editingHouse) {
        await api.put(`/admin/houses/${editingHouse.id}`, data);
        setMessage('Casa actualizada');
      } else {
        await api.post('/admin/houses', data);
        setMessage('Casa creada');
      }

      setForm({
        name: '',
        location: '',
        description: '',
        price: '',
        capacity: '',
        image: null
      });
      setEditingHouse(null);
      fetchHouses();

      if (imageRef.current) {
        imageRef.current.value = ''; // Limpiar el input de archivo
      }
    } catch {
      setMessage('Error al guardar la casa');
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await api.put(`/admin/houses/${id}/toggle`);
      fetchHouses();
    } catch {
      setMessage('Error al cambiar disponibilidad');
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
      image: null
    });

    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  return (
    <div>
      <h4>Casas registradas</h4>
      <ul className="list-group mb-4">
        {houses.map((house) => (
          <li key={house.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{house.name}</strong> – {house.location}<br />
              <small>{house.description}</small><br />
              Capacidad: {house.capacity} | {house.price} € / noche
            </div>
            <div>
              <span className={`badge ${house.availability ? 'bg-success' : 'bg-secondary'} me-2`}>
                {house.availability ? 'Activa' : 'Inactiva'}
              </span>
              <button onClick={() => toggleAvailability(house.id)} className="btn btn-sm btn-outline-warning me-2">
                Cambiar
              </button>
              <button onClick={() => handleEdit(house)} className="btn btn-sm btn-outline-primary">
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h5>{editingHouse ? 'Editar casa' : 'Añadir nueva casa'}</h5>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" className="form-control mb-2" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input name="location" className="form-control mb-2" placeholder="Ubicación" value={form.location} onChange={handleChange} required />
        <textarea name="description" className="form-control mb-2" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        <input type="number" name="price" className="form-control mb-2" placeholder="Precio por noche" value={form.price} onChange={handleChange} required />
        <input type="number" name="capacity" className="form-control mb-2" placeholder="Capacidad (número de personas)" value={form.capacity} onChange={handleChange} required />
        <input type="file" name="image" className="form-control mb-2" onChange={handleChange} accept="image/*" ref={imageRef} />
        <button className="btn btn-primary">{editingHouse ? 'Guardar cambios' : 'Crear casa'}</button>
      </form>
    </div>
  );
}

export default AdminHouses;
