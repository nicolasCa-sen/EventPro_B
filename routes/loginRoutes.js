const express = require('express');
const router = express.Router();
const { loginUsuario } = require('../controllers/loginController');  // Asegúrate de que la ruta es correcta

// Ruta para iniciar sesión
router.post('/login', loginUsuario);

module.exports = router;
