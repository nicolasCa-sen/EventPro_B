const routes = require('express').Router()

const {
    findById,
    updateOrganizador
} = require ('./../controllers/organizadorController')

routes.get("/:id",findById)
routes.put("/:id",updateOrganizador)

module.exports = routes;