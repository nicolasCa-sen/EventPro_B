const Lugar=require('./../models/lugar')
const Evento =require('./../models/evento')
const sequelize = require('../drivers/connect_db');
const { Op } = require('sequelize');


const lugarController = {
    save: async (req, res) => {
        try {
            const lugar = await Lugar.create(req.body);
            return res.status(200).json({ "state": true, "data": lugar });
        } catch (error) {
            console.error('Error al guardar un lugar:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const lugar = await  Lugar.findByPk(req.params.id); 

            if (!lugar) {
                return res.status(404).json({ "state": false, "message": "Lugar no encontrado" });
            }

            return res.status(200).json({ "state": true, "data": lugar });
        } catch (error) {
            console.error('Error al obtener el lugar:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const lugar = await Lugar.findByPk(id);

            if (!lugar) {
                return res.status(404).json({ "state": false, "message": "Lugar no encontrado" });
            }
            
            await lugar.update(req.body);
            return res.status(200).json({ "state": true, "data": lugar });
        } catch (error) {
            console.error('Error al actualizar el lugar:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    select: async (req, res) => {
        try {
            const lugares = await Lugar.findAll();

            return res.status(200).json({
                "state": true,
                "data": lugares
            });
        } catch (error) {
            console.error('Error al obtener los lugares:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    deletelu: async (req, res) => {
        try {
            const { id } = req.params;
            const lugar = await Lugar.findByPk(id);

            if (!lugar) {
                return res.status(404).json({ "state": false, "message": "Lugar no encontrado" });
            }
            const fechaActual = new Date();

            const eventosActivos = await Evento.findOne({
                where: {
                    id_lugar: id,
                    fecha_fin: {
                        [Op.gt]: fechaActual 
                    }
                }
            });
    
            if (eventosActivos) {
                return res.status(400).json({ 
                    "state": false, "message": "No se puede eliminar el lugar porque está asociado a un evento activo." });
            }
            await lugar.destroy();
            return res.status(200).json({ "state": true, "message": "Lugar eliminado correctamente" });
        } catch (error) {
            console.error('Error al eliminar el lugar:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }

};

module.exports = lugarController;
