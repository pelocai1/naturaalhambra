const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const upload = require('../middleware/uploadMiddleware');

const {
  getAllHouses,
  createHouse,
  updateHouse,
  toggleHouseAvailability
} = require('../controllers/houseController');

const {
  getAllUsers,
  updateUser
} = require('../controllers/userController');

const {
  getAllReservations,
  updateReservation
} = require('../controllers/reservationController');

// ---------------- CASAS ----------------
router.get('/houses', authenticate, authorizeAdmin, getAllHouses);

router.post(
  '/houses',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  createHouse
);

router.put(
  '/houses/:id',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  updateHouse
);

router.put(
  '/houses/:id/toggle',
  authenticate,
  authorizeAdmin,
  toggleHouseAvailability
);

// ---------------- USUARIOS ----------------
router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.put('/users/:id', authenticate, authorizeAdmin, updateUser);

// ---------------- RESERVAS ----------------
router.get('/reservations', authenticate, authorizeAdmin, getAllReservations);
router.put('/reservations/:id', authenticate, authorizeAdmin, updateReservation);

module.exports = router;
