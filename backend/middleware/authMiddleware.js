const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, se requiere token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Añadir el usuario decodificado al objeto de solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o expirado' });
  }
};

module.exports = authenticate;
