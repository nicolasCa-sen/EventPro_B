const routes = require('express').Router()

const {
    findById,
    updateOrganizador,
    select,
    deleteuor
} = require ('./../controllers/organizadorController')

routes.get("/:id",findById)
routes.get("/",select)
routes.put("/:id",updateOrganizador)
routes.delete("/:id",deleteuor)
module.exports = routes;