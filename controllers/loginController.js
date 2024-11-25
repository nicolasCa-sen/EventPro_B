const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Persona = require('../models/persona');  // Importamos el modelo Persona

const loginUsuario = async (req, res) => {
  console.log('Datos recibidos del frontend:', req.body);  // Para depurar

  const { email, password, role } = req.body; // Asegúrate de que estas claves coinciden con las enviadas desde el frontend

  try {
    // Verificar que los datos existen
    if (!email || !password || !role) {
      return res.status(400).json({ state: false, message: 'Faltan datos para iniciar sesión.' });
    }

    // Buscar al usuario por el email en la tabla Persona
    const usuario = await Persona.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ state: false, message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, usuario.contraseña);

    if (!validPassword) {
      return res.status(400).json({ state: false, message: 'Contraseña incorrecta' });
    }

    // Verificar el rol
    if (role.toLowerCase() !== usuario.rol.toLowerCase()) {
      return res.status(400).json({ state: false, message: 'Rol incorrecto' });
    }

    // Crear un JWT (token)
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol }, // El rol está aquí
        'tu_clave_secreta', // Clave secreta
        { expiresIn: '1h' }  // Expiración del token (1 hora)
      );
      
    // Crear un objeto con todos los datos del usuario
    const userData = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      identificacion: usuario.identificacion,
      fechaNacimiento: usuario.fechaNacimiento,
      rol: usuario.rol,
      imagen: usuario.imagen,  // Si tienes una imagen de perfil en la base de datos
      eventosMes: usuario.eventosMes,  // Esto puede ser dinámico, dependiendo de tu base de datos
      eventosAno: usuario.eventosAno,  // Lo mismo para los eventos
      gastoMes: usuario.gastoMes,  // Igualmente, lo puedes agregar dependiendo de tus necesidades
      gastoAno: usuario.gastoAno,  // Lo mismo para los gastos
    };

    // Enviar los datos del usuario junto con el token
    res.status(200).json({
      state: true,
      message: 'Login exitoso',
      token: token,  // El token JWT
      user: userData  // Los datos completos del usuario
    });
  } catch (error) {
    console.error('Error al realizar login:', error);
    res.status(500).json({ state: false, message: 'Error al realizar login' });
  }
};

module.exports = {
  loginUsuario,
};
