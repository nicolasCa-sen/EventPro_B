const { loginUsuario } = require('../controllers/authController');
const Persona = require('../models/persona');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/persona'); // Mock del modelo Persona
jest.mock('bcryptjs'); // Mock de bcrypt
jest.mock('jsonwebtoken'); // Mock de jwt

describe('Pruebas para loginUsuario', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('Debe retornar error si faltan datos para iniciar sesión', async () => {
    req.body = {}; // Simula datos faltantes

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'Faltan datos para iniciar sesión.',
    });
  });

  test('Debe retornar error si el usuario no existe', async () => {
    Persona.findOne.mockResolvedValue(null); // Mock para usuario no encontrado

    await loginUsuario(req, res);

    expect(Persona.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'Usuario no encontrado',
    });
  });

  test('Debe retornar error si la contraseña es incorrecta', async () => {
    const mockUsuario = { contraseña: 'hashedpassword' };
    Persona.findOne.mockResolvedValue(mockUsuario);
    bcrypt.compare.mockResolvedValue(false); // Contraseña incorrecta

    await loginUsuario(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'Contraseña incorrecta',
    });
  });

  test('Debe retornar error si el rol es incorrecto', async () => {
    const mockUsuario = { contraseña: 'hashedpassword', rol: 'user' };
    Persona.findOne.mockResolvedValue(mockUsuario);
    bcrypt.compare.mockResolvedValue(true); // Contraseña correcta

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'Rol incorrecto',
    });
  });

  test('Debe retornar un token y datos del usuario si el login es exitoso', async () => {
    const mockUsuario = {
      id: 1,
      nombre: 'John',
      apellido: 'Doe',
      email: 'test@example.com',
      telefono: '123456789',
      identificacion: '12345',
      fechaNacimiento: '1990-01-01',
      rol: 'admin',
      imagen: 'imagen.jpg',
      eventosMes: 5,
      eventosAno: 20,
      gastoMes: 100,
      gastoAno: 1200,
      contraseña: 'hashedpassword',
    };

    const mockToken = 'mocked-jwt-token';
    Persona.findOne.mockResolvedValue(mockUsuario);
    bcrypt.compare.mockResolvedValue(true); // Contraseña correcta
    jwt.sign.mockReturnValue(mockToken); // Token generado

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      state: true,
      message: 'Login exitoso',
      token: mockToken,
      user: {
        id: 1,
        nombre: 'John',
        apellido: 'Doe',
        email: 'test@example.com',
        telefono: '123456789',
        identificacion: '12345',
        fechaNacimiento: '1990-01-01',
        rol: 'admin',
        imagen: 'imagen.jpg',
        eventosMes: 5,
        eventosAno: 20,
        gastoMes: 100,
        gastoAno: 1200,
      },
    });
  });

  test('Debe manejar errores internos correctamente', async () => {
    Persona.findOne.mockRejectedValue(new Error('Error de base de datos')); // Simula un error en la base de datos

    await loginUsuario(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'Error al realizar login',
    });
  });
});
