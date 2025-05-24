const { Sequelize } = require('sequelize');  // <-- IMPORTANTE: Verifica esta línea
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('🟢 Conexión a la base de datos exitosa'))
  .catch(err => console.error('🔴 Error al conectar a la base de datos:', err));

module.exports = sequelize;
