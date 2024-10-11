const routes = require('express').Router()

const {
    findById,
    save,
    update
} = require ('./../controllers/organizacionController')


routes.get("/:id",findById)
routes.post("/",save)
routes.put("/:id",update)

module.exports = routes;