const routes = require('express').Router()

const {
    registrarse,
    updateUsuario,
    findById,
    select
} = require ('./../controllers/usuarioController')

routes.get('/usuarios', select);
routes.post("/",registrarse)
routes.get("/:id",findById)
routes.put("/:id",updateUsuario)

module.exports = routes;