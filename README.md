# 🌿 Natura Alhambra

Aplicación web para la reserva de casas rurales en Granada, con panel de administración, gestión de usuarios, reservas, valoraciones y compatibilidad con Azure para imágenes.

---

## 🚀 Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/) (si usas base de datos local)
- Git (opcional)
- Acceso a tu cuenta de Azure si usas Blob Storage

---

## 📁 Estructura del proyecto

```
natura-alhambra/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   └── .env
│
├── frontend/
│   ├── src/
│   └── public/
```

---

## 🔧 Configuración

### 1. Clonar o copiar el proyecto

Si está en tu OneDrive, solo navega a la carpeta:

```bash
cd natura-alhambra
```

### 2. Instalar dependencias

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

### 3. Configurar entorno

Asegúrate de tener un archivo `.env` en `/backend` con variables como:

```
PORT=3001
DB_URL=postgres://usuario:contraseña@localhost:5432/natura_alhambra
JWT_SECRET=supersecreto
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_CONTAINER_NAME=houses
```

---

## 🖥 Iniciar el proyecto

### 🧠 Backend

Desde la carpeta `backend/`:

```bash
npm run dev   # o nodemon server.js
```

### 🎨 Frontend

Desde la carpeta `frontend/`:

```bash
npm start     # si usas CRA
# o
npm run dev   # si usas Vite
```

Abre el navegador en:

```
http://localhost:3000
```

---

## 🐾 Características destacadas

- Registro e inicio de sesión con roles (usuario / admin)
- Subida de imágenes a Azure Blob Storage
- Reservas con validación de fechas
- Valoraciones y comentarios
- Pet Friendly 🐶
- Panel administrativo
- Filtros dinámicos de búsqueda
- Interfaz responsiva y agradable 🌄

---

## 👩‍💼 Autoría

Proyecto desarrollado por Francisco Javier Barragán como parte del seguimiento con Natalia Escriva.
