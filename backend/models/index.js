const sequelize = require('../config/database');
const User = require('./User');
const Reservation = require('./Reservation');
const House = require('./House');
const Comment = require('./Comment');  // Asegúrate de que esta línea esté presente

// Relaciones entre modelos
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

House.hasMany(Reservation, { foreignKey: 'houseId' });
Reservation.belongsTo(House, { foreignKey: 'houseId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

House.hasMany(Comment, { foreignKey: 'houseId' });
Comment.belongsTo(House, { foreignKey: 'houseId' });

module.exports = {
  sequelize,
  User,
  Reservation,
  House,
  Comment  // Asegúrate de que esta línea esté presente
};
