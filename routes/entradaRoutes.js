const routes = require('express').Router()

const {
    findById,
    save,
    cambiosSinCompra,
} = require ('./../controllers/entradaController')


routes.get("/:id",findById)
routes.post("/",save)
routes.put("/:id",cambiosSinCompra)

module.exports = routes; 