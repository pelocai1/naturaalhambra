const express = require("express");
const {
  createReservation,
  getAllReservations,
  getUserReservations,
  cancelReservation,
  checkAvailability,
  getHouseReservations,
  simulatePayment,
  updateReservation,
  deleteCancelledUnconfirmed,
  filterReservations,
} = require("../controllers/reservationController");

const authenticate = require("../middleware/authMiddleware");
const authorizeAdmin = require("../middleware/authorizeAdmin"); // solo si necesitas protección admin

const router = express.Router();

// Todas las rutas se montarán bajo /api/reservations en server.js

// 🛠 Obtener todas las reservas (admin)
router.get("/", authenticate, authorizeAdmin, getAllReservations);

// 👤 Obtener reservas del usuario autenticado
router.get("/user/:userId", authenticate, getUserReservations);

// 🏠 Obtener reservas de una casa
router.get("/house/:houseId", getHouseReservations);

// ✅ Comprobar disponibilidad para reservar
router.get("/check", checkAvailability);

// ➕ Crear nueva reserva
router.post("/", authenticate, createReservation);

// ❌ Cancelar una reserva
router.put("/:id/cancel", authenticate, cancelReservation);

router.post("/pagar/:id", simulatePayment);

router.post("/admin/filter", authenticate, authorizeAdmin, filterReservations);

router.delete(
  "/admin/clean-cancelled",
  authenticate,
  authorizeAdmin,
  deleteCancelledUnconfirmed
);

module.exports = router;
