require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const houseRoutes = require('./routes/houseRoutes'); // Asegúrate de tener esta línea
const commentRoutes = require('./routes/commentRoutes'); // Importar rutas de comentarios
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Natura Alhambra Backend' });
});

// Rutas de usuario
app.use('/api/users', userRoutes);

// Rutas de reservas
app.use('/api/reservations', reservationRoutes);

// Rutas de casas (importante)
app.use('/api', houseRoutes);

// Rutas de comentarios
app.use('/api', commentRoutes);

app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sincronización de la base de datos y servidor
sequelize.sync({ alter: true })
    .then(() => {
        console.log('🟢 Conexión establecida con PostgreSQL');
        app.listen(PORT, () => {
            console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => console.error('❌ Error de conexión:', error));
