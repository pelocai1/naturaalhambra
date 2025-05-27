const { Comment } = require('../models');
const { sanitizeComment } = require('../utils/sanitize');

// Añadir un comentario con valoración
const addComment = async (req, res) => {
  try {
    const { userId, houseId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La valoración debe estar entre 1 y 5' });
    }

    if (!sanitizeComment(comment)) {
      return res.status(400).json({ message: 'El comentario contiene palabras inapropiadas' });
    }

    const newComment = await Comment.create({ userId, houseId, rating, comment });
    res.status(201).json({ message: 'Comentario añadido con éxito', comment: newComment });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el comentario', error: error.message });
  }
};

// Obtener el promedio de valoraciones de una casa
const getHouseRating = async (req, res) => {
  try {
    const { houseId } = req.params;

    const comments = await Comment.findAll({ where: { houseId } });

    if (comments.length === 0) {
  return res.status(200).json({ averageRating: null, totalReviews: 0 });
}

    const totalRatings = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const averageRating = totalRatings / comments.length;

    res.status(200).json({ 
      message: 'Promedio de valoraciones obtenido', 
      averageRating: averageRating.toFixed(2), 
      totalReviews: comments.length 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el promedio de valoraciones', error: error.message });
  }
};

// Editar un comentario
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const existingComment = await Comment.findByPk(id);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La valoración debe estar entre 1 y 5' });
    }

    if (!sanitizeComment(comment)) {
      return res.status(400).json({ message: 'El comentario contiene palabras inapropiadas' });
    }

    existingComment.rating = rating;
    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).json({ message: 'Comentario actualizado con éxito', comment: existingComment });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el comentario', error: error.message });
  }
};

// Eliminar un comentario
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comentario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el comentario', error: error.message });
  }
};

// Listar comentarios de una casa
const getCommentsByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const comments = await Comment.findAll({ where: { houseId } });

    // Siempre responde 200, aunque esté vacío
    res.status(200).json({ message: 'Comentarios obtenidos', comments });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
  }
};

const getAverageRating = async (req, res) => {
  req.params.houseId = req.params.id; // alias para compatibilidad con frontend
  return getHouseRating(req, res);    // reutilizamos tu función existente
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  getCommentsByHouse,
  getHouseRating,
  getAverageRating // 👈 añade esto
};
