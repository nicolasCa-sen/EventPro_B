const routes = require('express').Router()

const {
    findById,
    save,
    update,
    select,
    deleteor
} = require ('./../controllers/organizacionController')


routes.get("/:id",findById)
routes.get("/",select)
routes.post("/",save)
routes.put("/:id",update)
routes.delete("/:id",deleteor)

module.exports = routes;