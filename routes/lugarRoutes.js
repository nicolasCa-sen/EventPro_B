const routes = require('express').Router()

const {
    findById,
    save,
    update,
    select,
    deletelu
} = require ('./../controllers/lugarController')


routes.get("/:id",findById)
routes.get("/",select)
routes.post("/",save)
routes.put("/:id",update)
routes.delete("/:id",deletelu)

module.exports = routes;