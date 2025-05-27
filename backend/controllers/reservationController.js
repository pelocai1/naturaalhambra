const { Reservation, House, User } = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");

// Crear una reserva
const createReservation = async (req, res) => {
  try {
    const { userId, houseId, startDate, endDate } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "La fecha de inicio debe ser anterior a la de fin" });
    }

    const reservation = await Reservation.create({
      userId,
      houseId,
      startDate,
      endDate,
      status: "pending",
    });

    res.status(201).json({ message: "Reserva creada con éxito", reservation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la reserva", error: error.message });
  }
};

// Verificar disponibilidad
const checkAvailability = async (req, res) => {
  try {
    const { houseId, startDate, endDate } = req.query;

    if (!houseId || !startDate || !endDate) {
      return res.status(400).json({ message: "Faltan parámetros requeridos" });
    }

    const overlapping = await Reservation.findOne({
      where: {
        houseId,
        status: { [Op.not]: "cancelled" },
        startDate: { [Op.lt]: endDate },
        endDate: { [Op.gt]: startDate },
      },
    });

    res.json({ available: !overlapping });
  } catch (error) {
    res.status(500).json({
      message: "Error al comprobar disponibilidad",
      error: error.message,
    });
  }
};

// Obtener reservas de un usuario
const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza a medianoche

    const reservations = await Reservation.findAll({
      where: {
        userId,
        [Op.or]: [
          { status: { [Op.ne]: "cancelled" } },
          {
            status: "cancelled",
            startDate: { [Op.lte]: today }, // Ya pasó o está en curso
          },
        ],
      },
      include: [{ model: House, attributes: ["name", "location"] }],
    });

    res.status(200).json({ message: "Reservas obtenidas", reservations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener reservas", error: error.message });
  }
};

// Obtener reservas de una casa
const getHouseReservations = async (req, res) => {
  try {
    const { houseId } = req.params;

    const reservations = await Reservation.findAll({
      where: {
        houseId,
        status: { [Op.not]: "cancelled" },
      },
      attributes: ["startDate", "endDate"],
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reservas de la casa",
      error: error.message,
    });
  }
};

// Cancelar una reserva
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.json({ message: "Reserva cancelada", reservation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al cancelar la reserva", error: error.message });
  }
};

// Obtener todas las reservas (admin)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: House, attributes: ["name", "location"] },
      ],
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener todas las reservas",
      error: error.message,
    });
  }
};

// Actualizar reserva (admin u operador)
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;

    const reservation = await Reservation.findByPk(id);
    if (!reservation)
      return res.status(404).json({ message: "Reserva no encontrada" });

    if (startDate) reservation.startDate = startDate;
    if (endDate) reservation.endDate = endDate;
    if (status) reservation.status = status;

    await reservation.save();

    res.json({ message: "Reserva actualizada con éxito", reservation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar reserva", error: error.message });
  }
};

const deleteCancelledUnconfirmed = async (req, res) => {
  try {
    const deletedCount = await Reservation.destroy({
      where: {
        status: "cancelled",
        accessCode: null, // nunca se confirmó
      },
    });

    res.json({ message: `Se eliminaron ${deletedCount} reservas canceladas.` });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar reservas canceladas",
      error: error.message,
    });
  }
};

// Simulación de pago y envío de correo
const simulatePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await Reservation.findByPk(id, {
      include: [{ model: User }, { model: House }],
    });

    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reserva.status !== "pending") {
      return res.status(400).json({ message: "La reserva ya fue procesada" });
    }

    const accessCode = crypto.randomBytes(4).toString("hex");

    reserva.status = "confirmed";
    reserva.accessCode = accessCode;
    await reserva.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const logoPath = path.join(__dirname, "..", "uploads", "imagen1.png");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reserva.User.email,
      subject: "Confirmación de tu reserva – Natura Alhambra",
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logoimg",
        },
      ],
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #0b0c10; padding: 30px; color: #d1d1d1;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1c1c1c; border-radius: 10px; padding: 30px;">
            <div style="text-align: center;">
              <img src="cid:logoimg" alt="Logo Natura Alhambra" style="width: 200px; margin-bottom: 20px;" />
              <h1 style="color: #3ddc97; margin-bottom: 10px;">¡Reserva Confirmada!</h1>
              <p style="font-size: 1.1em; color: #d1d1d1;">Gracias por elegir <strong>Natura Alhambra</strong></p>
            </div>

            <hr style="border: 0; border-top: 1px solid #444; margin: 20px 0;" />

            <p style="color: #d1d1d1;"><strong>Reserva a nombre de:</strong> ${
              reserva.User.name
            }</p>
            <p><strong>Casa:</strong> ${reserva.House.name}</p>
            <p><strong>Desde:</strong> ${new Date(
              reserva.startDate
            ).toLocaleDateString()}</p>
            <p><strong>Hasta:</strong> ${new Date(
              reserva.endDate
            ).toLocaleDateString()}</p>

            <div style="margin: 30px 0; text-align: center;">
              <p style="color: #d1d1d1;">Tu código de acceso es:</p>
              <div style="font-size: 2em; color: #e9c46a; font-weight: bold; letter-spacing: 2px;">
                ${reserva.accessCode}
              </div>
            </div>

            <p style="color: #d1d1d1;">Este código será válido solo durante tu estancia.</p>
            <p style="color: #d1d1d1;">Si tienes alguna duda, puedes responder a este correo o visitar nuestro sitio.</p>

            <hr style="border: 0; border-top: 1px solid #444; margin: 30px 0;" />

            <p style="text-align: center; font-size: 0.85em; color: #888;">
              Natura Alhambra · Vive Granada<br/>
              www.naturalhambra.com
            </p>
          </div>
        </div>
      `,
    });

    res.status(200).json({
      message: "Pago realizado con éxito, código enviado al usuario.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al procesar el pago",
      error: error.message,
    });
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
  simulatePayment,
  deleteCancelledUnconfirmed,
};
