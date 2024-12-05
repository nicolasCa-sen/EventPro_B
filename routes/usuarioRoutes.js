const routes = require('express').Router()

const {
    registrarse,
    updateUsuario,
    findById,
    select,
    solicitudCredencial,
    deleteus,
    findByEmail
} = require ('./../controllers/usuarioController')

routes.get('/usuarios', select);
routes.post("/",registrarse);
routes.get("/:id",findById);
routes.put("/:id",updateUsuario);
routes.post("/solicitud",solicitudCredencial);
routes.delete("/:id",deleteus);
routes.post('/find-by-email', findByEmail);

module.exports = routes;