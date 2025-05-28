import React, { useState } from "react";
import AdminHouses from "./admin/AdminHouses";
import AdminReservations from "./admin/AdminReservations";
import AdminUsers from "./admin/AdminUsers";

function AdminPanel() {
  const [section, setSection] = useState("houses");

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Panel de Administración</h2>

      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-success ${
              section === "houses" ? "active" : ""
            }`}
            onClick={() => setSection("houses")}
          >
            Casas
          </button>
          <button
            className={`btn btn-outline-success ${
              section === "reservations" ? "active" : ""
            }`}
            onClick={() => setSection("reservations")}
          >
            Reservas
          </button>
          <button
            className={`btn btn-outline-success ${
              section === "users" ? "active" : ""
            }`}
            onClick={() => setSection("users")}
          >
            Usuarios
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-4 shadow-sm">
        {section === "houses" && <AdminHouses />}
        {section === "reservations" && <AdminReservations />}
        {section === "users" && <AdminUsers />}
      </div>
    </div>
  );
}

export default AdminPanel;
