const routes = require('express').Router()

const {
    cambioCredenciales
} = require ('./../controllers/administradorController')

routes.put("/:id",cambioCredenciales)

module.exports = routes;