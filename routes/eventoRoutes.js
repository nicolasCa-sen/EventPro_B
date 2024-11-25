const routes = require('express').Router()

const {
    findById,
    save,
    update,
    select,
    deleteev
   
} = require ('./../controllers/eventoController')


routes.get("/:id",findById)
routes.post("/",save)
routes.get("/", select)
routes.put("/:id",update)
routes.delete("/:id",deleteev)


module.exports = routes;