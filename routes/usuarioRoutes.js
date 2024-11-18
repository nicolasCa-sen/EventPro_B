const routes = require('express').Router()

const {
    registrarse,
    updateUsuario,
    findById
} = require ('./../controllers/usuarioController')


routes.post("/",registrarse)
routes.get("/:id",findById)
routes.put("/:id",updateUsuario)

module.exports = routes;