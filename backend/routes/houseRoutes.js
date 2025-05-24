const express = require('express');
const { 
  createHouse,
  getAllHouses, 
  getHouseById, 
  updateHouse, 
} = require('../controllers/houseController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta para añadir una casa
router.post('/houses', authenticate, createHouse);

// Ruta para listar todas las casas
router.get('/houses', getAllHouses);

// Ruta para obtener los detalles de una casa específica
router.get('/houses/:id', getHouseById);

// Ruta para actualizar la información de una casa
router.put('/houses/:id', authenticate, updateHouse);

module.exports = router;
