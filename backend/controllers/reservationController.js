const { Reservation, House, User } = require('../models');
const { Op } = require('sequelize');

// Crear una reserva
const createReservation = async (req, res) => {
  try {
    const { userId, houseId, startDate, endDate } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'La fecha de inicio debe ser anterior a la de fin' });
    }

    const reservation = await Reservation.create({
      userId,
      houseId,
      startDate,
      endDate,
      status: 'pending'
    });

    res.status(201).json({ message: 'Reserva creada con éxito', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
  }
};

// Verificar disponibilidad
const checkAvailability = async (req, res) => {
  try {
    const { houseId, startDate, endDate } = req.query;

    if (!houseId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    const overlapping = await Reservation.findOne({
      where: {
        houseId,
        status: { [Op.not]: 'cancelled' },
        startDate: { [Op.lt]: endDate },
        endDate: { [Op.gt]: startDate }
      }
    });

    res.json({ available: !overlapping });
  } catch (error) {
    res.status(500).json({ message: 'Error al comprobar disponibilidad', error: error.message });
  }
};

// Obtener reservas de un usuario
const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await Reservation.findAll({
      where: { userId },
      include: [{ model: House, attributes: ['name', 'location'] }]
    });

    res.status(200).json({ message: 'Reservas obtenidas', reservations });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error: error.message });
  }
};

// Obtener reservas de una casa
const getHouseReservations = async (req, res) => {
  try {
    const { houseId } = req.params;

    const reservations = await Reservation.findAll({
      where: {
        houseId,
        status: { [Op.not]: 'cancelled' }
      },
      attributes: ['startDate', 'endDate']
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas de la casa', error: error.message });
  }
};

// Cancelar una reserva
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reserva cancelada', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
  }
};

// Obtener todas las reservas (admin)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: House, attributes: ['name', 'location'] }
      ]
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las reservas', error: error.message });
  }
};

const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });

    if (startDate) reservation.startDate = startDate;
    if (endDate) reservation.endDate = endDate;
    if (status) reservation.status = status;

    await reservation.save();

    res.json({ message: 'Reserva actualizada con éxito', reservation });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar reserva', error: error.message });
  }
};

module.exports = {
  createReservation,
  checkAvailability,
  getUserReservations,
  getHouseReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
};
