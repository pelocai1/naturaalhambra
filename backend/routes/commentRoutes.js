const express = require('express');
const { 
  addComment, 
  updateComment, 
  deleteComment, 
  getCommentsByHouse, 
  getHouseRating 
} = require('../controllers/commentController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Ruta para añadir un comentario (requiere autenticación)
router.post('/comments', authenticate, addComment);

// Ruta para actualizar un comentario (requiere autenticación)
router.put('/comments/:id', authenticate, updateComment);

// Ruta para eliminar un comentario (requiere autenticación)
router.delete('/comments/:id', authenticate, deleteComment);

// Ruta para obtener los comentarios de una casa
router.get('/comments/house/:houseId', getCommentsByHouse);

// Ruta para obtener el promedio de valoraciones de una casa
router.get('/comments/house/:houseId/rating', getHouseRating);

module.exports = router;
