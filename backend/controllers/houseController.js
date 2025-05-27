const fs = require('fs').promises;
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const House = require('../models/House');
const { uploadImageToAzure, deleteImageFromAzure } = require('../services/azureBlobService');

/**
 * Devuelve page, limit y offset a partir de la query string
 * page >= 1, limit entre 1 y 100
 */
const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// ────────────────────────────────────────────────────────────────────────────────
// Crear casa
// ────────────────────────────────────────────────────────────────────────────────
const createHouse = async (req, res, next) => {
  console.log('📥 req.file:', req.file);
  const t = await sequelize.transaction();
  try {
    const { name, location, description, price, capacity } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImageToAzure(req.file.path, req.file.filename);
      await fs.unlink(req.file.path);
    }

    const house = await House.create(
      { name, location, description, price, capacity, imageUrl, availability: true },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({ message: 'Casa creada con éxito', data: house });
  } catch (error) {
    await t.rollback();
    if (req.file) {
      try { await fs.unlink(req.file.path); } catch (_) {}
    }
    return next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────────
// Listar casas con filtros y paginación
// ────────────────────────────────────────────────────────────────────────────────
const getAllHouses = async (req, res, next) => {
  try {
    const { available, location, maxPrice, capacity } = req.query;
    const { page, limit, offset } = parsePagination(req.query);

    const where = {};
    if (available !== undefined) where.availability = available === 'true';
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (maxPrice) where.price = { [Op.lte]: maxPrice };
    if (capacity) where.capacity = { [Op.gte]: capacity };

    const { rows: houses, count: total } = await House.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      data: houses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    return next(error);
  }
};


// ────────────────────────────────────────────────────────────────────────────────
// Obtener casa por id
// ────────────────────────────────────────────────────────────────────────────────
const getHouseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const house = await House.findByPk(id);
    if (!house) return res.status(404).json({ message: 'Casa no encontrada' });
    return res.json({ data: house });
  } catch (error) {
    return next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────────
// Actualizar casa
// ────────────────────────────────────────────────────────────────────────────────
const updateHouse = async (req, res, next) => {
  console.log('📥 req.file:', req.file);
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, location, description, price, capacity, availability } = req.body;

    const house = await House.findByPk(id, { transaction: t });
    if (!house) {
      await t.rollback();
      return res.status(404).json({ message: 'Casa no encontrada' });
    }

    let newImageUrl = house.imageUrl;
    let oldImageUrl = house.imageUrl;

    if (req.file) {
      newImageUrl = await uploadImageToAzure(req.file.path, req.file.filename);
      await fs.unlink(req.file.path);
    }

    await house.update(
      {
        name: name ?? house.name,
        location: location ?? house.location,
        description: description ?? house.description,
        price: price ?? house.price,
        capacity: capacity ?? house.capacity,
        availability: availability ?? house.availability,
        imageUrl: newImageUrl
      },
      { transaction: t }
    );

    await t.commit();

    // Elimina el blob antiguo de forma asíncrona (fuera de la transacción)
    if (req.file && oldImageUrl && oldImageUrl !== newImageUrl) {
      deleteImageFromAzure(oldImageUrl).catch(console.error);
    }

    return res.json({ message: 'Casa actualizada con éxito', data: house });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

// ────────────────────────────────────────────────────────────────────────────────
// Alternar disponibilidad
// ────────────────────────────────────────────────────────────────────────────────
const toggleHouseAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const house = await House.findByPk(id);
    if (!house) return res.status(404).json({ message: 'Casa no encontrada' });

    house.availability = !house.availability;
    await house.save();

    return res.json({
      message: `Casa ${house.availability ? 'activada' : 'desactivada'}`,
      data: house
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createHouse,
  getAllHouses,
  getHouseById,
  updateHouse,
  toggleHouseAvailability
};