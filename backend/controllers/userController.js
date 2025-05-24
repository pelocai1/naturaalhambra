const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar el usuario', error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

const createAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const user = await User.create({
      name: 'Admin',
      email: 'admin@natura.com',
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({ message: 'Admin creado', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear admin', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'active']
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, active } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (role) user.role = role;
    if (typeof active !== 'undefined') user.active = active;

    await user.save();

    res.json({ message: 'Usuario actualizado con éxito', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

module.exports = {
  register,
  login,
  createAdmin,
  getAllUsers,
  updateUser
};