const routes = require('express').Router()

const {
    findById,
    save,
    update
} = require ('./../controllers/eventoController')


routes.get("/:id",findById)
routes.post("/",save)
routes.put("/:id",update)

module.exports = routes;