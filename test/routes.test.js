const request = require('supertest'); // Para hacer solicitudes HTTP
const express = require('express');
const routes = require('../routes/entradaRoutes'); // Ruta del archivo que contiene las rutas
const entradaController = require('../controllers/entradaController');

// Mockear las funciones del controlador
jest.mock('../controllers/entradaController', () => ({
  findById: jest.fn(),
  save: jest.fn(),
  cambiosSinCompra: jest.fn(),
  cambiosVenta: jest.fn(),
  select: jest.fn(),
  obtenerTotal: jest.fn(),
  obtenerPrecio: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/entradas', routes); // Monta las rutas en la app Express

describe('Pruebas para las rutas de entrada', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
  });

  test('GET /entradas/:id debe llamar a findById', async () => {
    entradaController.findById.mockImplementation((req, res) =>
      res.status(200).json({ id: req.params.id, name: 'Entrada de prueba' })
    );

    const response = await request(app).get('/entradas/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'Entrada de prueba' });
    expect(entradaController.findById).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '1' } }),
      expect.any(Object)
    );
  });

  test('GET /entradas debe llamar a select', async () => {
    entradaController.select.mockImplementation((req, res) =>
      res.status(200).json([{ id: 1, name: 'Entrada 1' }, { id: 2, name: 'Entrada 2' }])
    );

    const response = await request(app).get('/entradas');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Entrada 1' },
      { id: 2, name: 'Entrada 2' },
    ]);
    expect(entradaController.select).toHaveBeenCalled();
  });

  test('POST /entradas/total debe llamar a obtenerTotal', async () => {
    entradaController.obtenerTotal.mockImplementation((req, res) =>
      res.status(200).json({ total: 100 })
    );

    const response = await request(app).post('/entradas/total').send({ eventoId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ total: 100 });
    expect(entradaController.obtenerTotal).toHaveBeenCalledWith(
      expect.objectContaining({ body: { eventoId: 1 } }),
      expect.any(Object)
    );
  });

  test('GET /entradas/precio/:id_evento debe llamar a obtenerPrecio', async () => {
    entradaController.obtenerPrecio.mockImplementation((req, res) =>
      res.status(200).json({ id_evento: req.params.id_evento, precio: 50 })
    );

    const response = await request(app).get('/entradas/precio/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id_evento: '1', precio: 50 });
    expect(entradaController.obtenerPrecio).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id_evento: '1' } }),
      expect.any(Object)
    );
  });

  test('POST /entradas debe llamar a save', async () => {
    entradaController.save.mockImplementation((req, res) =>
      res.status(201).json({ id: 1, name: 'Nueva Entrada' })
    );

    const response = await request(app)
      .post('/entradas')
      .send({ name: 'Nueva Entrada', eventoId: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, name: 'Nueva Entrada' });
    expect(entradaController.save).toHaveBeenCalledWith(
      expect.objectContaining({ body: { name: 'Nueva Entrada', eventoId: 1 } }),
      expect.any(Object)
    );
  });

  test('PUT /entradas/:id debe llamar a cambiosSinCompra', async () => {
    entradaController.cambiosSinCompra.mockImplementation((req, res) =>
      res.status(200).json({ id: req.params.id, status: 'actualizado' })
    );

    const response = await request(app).put('/entradas/1').send({ status: 'actualizado' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', status: 'actualizado' });
    expect(entradaController.cambiosSinCompra).toHaveBeenCalledWith(
      expect.objectContaining({ params: { id: '1' }, body: { status: 'actualizado' } }),
      expect.any(Object)
    );
  });

  test('PUT /entradas debe llamar a cambiosVenta', async () => {
    entradaController.cambiosVenta.mockImplementation((req, res) =>
      res.status(200).json({ status: 'venta actualizada' })
    );

    const response = await request(app).put('/entradas').send({ ventaId: 1, status: 'completado' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'venta actualizada' });
    expect(entradaController.cambiosVenta).toHaveBeenCalledWith(
      expect.objectContaining({ body: { ventaId: 1, status: 'completado' } }),
      expect.any(Object)
    );
  });
});
