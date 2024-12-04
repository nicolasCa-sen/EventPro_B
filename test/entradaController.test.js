const request = require('supertest');
const express = require('express');
const entradaController = require('../controllers/entradaController');
const Entrada = require('../models/entrada');
const Evento = require('../models/evento');
const Usuario = require('../models/persona');

jest.mock('../models/entrada');
jest.mock('../models/evento');
jest.mock('../models/persona');

const app = express();
app.use(express.json());
app.post('/entradas', entradaController.save);
app.get('/entradas/:id', entradaController.findById);
app.put('/entradas/:id', entradaController.cambiosSinCompra);
app.put('/entradas', entradaController.cambiosVenta);
app.get('/entradas', entradaController.select);
app.get('/entradas/precio/:id_evento', entradaController.obtenerPrecio);
app.post('/entradas/total', entradaController.obtenerTotal);

describe('Pruebas para entradaController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /entradas debe guardar una entrada', async () => {
    Evento.findByPk.mockResolvedValue({ id: 1 });
    Entrada.create.mockResolvedValue({ id: 1, disponible: true });
    const response = await request(app).post('/entradas').send({ id_evento: 1, precio: 100 });
    expect(response.status).toBe(200);
    expect(response.body.state).toBe(true);
  });
});
