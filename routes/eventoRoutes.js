const routes = require('express').Router()

const {
    findById,
    save,
    update,
    select
} = require ('./../controllers/eventoController')


routes.get("/:id",findById)
routes.post("/",save)
routes.get("/", select);
routes.put("/:id",update)

module.exports = routes;