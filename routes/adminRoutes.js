const routes = require('express').Router()

const {
    cambioCredenciales
} = require ('./../controllers/administradorController')

routes.put("/",cambioCredenciales)

module.exports = routes;