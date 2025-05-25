const express = require('express');
const {
  createHouse,
  getAllHouses,
  getHouseById,
  updateHouse,
} = require('../controllers/houseController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Crear casa (con imagen)
router.post('/houses', authenticate, upload.single('image'), createHouse);

// Listar casas
router.get('/houses', getAllHouses);

// Obtener casa específica
router.get('/houses/:id', getHouseById);

// Actualizar casa (con imagen)
router.put('/houses/:id', authenticate, upload.single('image'), updateHouse);

module.exports = router;
