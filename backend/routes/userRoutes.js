const express = require('express');
const { register, login } = require('../controllers/userController');
const router = express.Router();
const { createAdmin } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdmin); 
router.get('/users', authenticate, getAllUsers);

module.exports = router;
