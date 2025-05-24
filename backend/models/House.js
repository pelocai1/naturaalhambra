const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const House = sequelize.define('House', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  availability: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imageUrl: {
  type: DataTypes.STRING,
  allowNull: true,
},
  capacity: { // 👈 nuevo campo
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2 // puedes cambiar el valor por defecto
  }
}, {
  timestamps: true,
});

module.exports = House;
