// adminController.test.js
const adminController = require('../controllers/adminController');
const Persona = require('../models/persona');
const Organizacion = require('../models/organizacion');

// Mockear los métodos de los modelos
jest.mock('../models/persona');
jest.mock('../models/organizacion');

describe('Pruebas para adminController.cambioCredenciales', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiar mocks entre pruebas
  });

  test('Debe retornar error si el usuario no existe', async () => {
    // Mock de Persona.findByPk para devolver null
    Persona.findByPk.mockResolvedValue(null);

    const req = { body: { id_usuario: 1, id_organizacion: 2 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await adminController.cambioCredenciales(req, res);

    expect(Persona.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'Usuario no encontrado',
    });
  });

  test('Debe retornar error si la organización no existe', async () => {
    // Mock de Persona.findByPk y Organizacion.findByPk
    Persona.findByPk.mockResolvedValue({ id: 1, rol: 'Usuario' });
    Organizacion.findByPk.mockResolvedValue(null);

    const req = { body: { id_usuario: 1, id_organizacion: 2 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await adminController.cambioCredenciales(req, res);

    expect(Organizacion.findByPk).toHaveBeenCalledWith(2);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      message: 'La organizacion no existe ',
    });
  });

  test('Debe actualizar las credenciales si los datos son válidos', async () => {
    // Mock de Persona.findByPk, Organizacion.findByPk y Persona.update
    const mockUsuario = { id: 1, rol: 'Usuario' };
    Persona.findByPk.mockResolvedValue(mockUsuario);
    Organizacion.findByPk.mockResolvedValue({ id: 2 });
    Persona.update.mockResolvedValue([1]); // Actualización exitosa

    const req = { body: { id_usuario: 1, id_organizacion: 2 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await adminController.cambioCredenciales(req, res);

    expect(Persona.update).toHaveBeenCalledWith(
      {
        numero_cuenta: null,
        numero_credencial: null,
        rol: 'Organizador',
        id_organizacion: 2,
      },
      { where: { id: 1 } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      state: true,
      data: mockUsuario,
    });
  });

  test('Debe manejar errores internos correctamente', async () => {
    // Mock de Persona.findByPk para lanzar un error
    Persona.findByPk.mockRejectedValue(new Error('Error de base de datos'));

    const req = { body: { id_usuario: 1, id_organizacion: 2 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await adminController.cambioCredenciales(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      state: false,
      error: 'Error de base de datos',
    });
  });
});
