const routes = require('express').Router()

const {
    findById,
    save,
    cambiosSinCompra,
    cambiosVenta,
    select,
    obtenerTotal,
    obtenerPrecio,
    eventosYEntradasPorUsuario,
    obtenerEventoCompleto
} = require ('./../controllers/entradaController')
const { route } = require('./eventoRoutes')


routes.get("/:id",findById)
routes.get("/",select)
routes.post("/total",obtenerTotal)
routes.get("/precio/:id_evento",obtenerPrecio)
routes.post("/",save)
routes.put("/:id",cambiosSinCompra)
routes.put("/",cambiosVenta)
routes.get("/usuario/:id_usuario/eventos-entradas", eventosYEntradasPorUsuario);
routes.get('/evento/:id_evento/recibo-completo', obtenerEventoCompleto);

module.exports = routes; 