const Evento = require('./../models/evento');
const Lugar = require('./../models/lugar'); // Importa el modelo Lugar
const Organizacion = require('./../models/organizacion'); // Importa el modelo Organizacion
const moment = require('moment-timezone');

const eventoController = {
    save: async (req, res) => {
        try {
            
            const lugar = await Lugar.findByPk(req.body.id_lugar); 
            if (!lugar) {
                return res.status(404).json({ "state": false, "message": "Lugar no encontrado" });
            }
            const organizacion = await Organizacion.findByPk(req.body.id_organizacion); // Usar findByPk directamente desde el modelo
            if (!organizacion) {
                return res.status(404).json({ "state": false, "message": "Organización no encontrada" });
            }
            
            const evento=await Evento.create(req.body);
            return res.status(200).json({ "state": true, "data": evento });
        } catch (error) {
            console.error('Error al guardar un evento:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const evento = await Evento.findByPk(req.params.id);

            if (!evento) {
                return res.status(404).json({ "state": false, "message": "Evento no encontrado" });
            }

            const fechaInicio = moment.utc(evento.fecha_inicio).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
            const fechaFin = moment.utc(evento.fecha_fin).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

            return res.status(200).json({ 
                "state": true, 
                "data": {
                    ...evento.toJSON(),
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                } 
            });
        } catch (error) {
            console.error('Error al obtener evento:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const evento = await Evento.findByPk(id);

            if (!evento) {
                return res.status(404).json({ "state": false, "message": "Evento no encontrado" });
            }
            const lugar = await Lugar.findByPk(req.body.id_lugar); 
            if (!lugar) {
                return res.status(404).json({ "state": false, "message": "Lugar no encontrado" });
            }

            
            const organizacion = await Organizacion.findByPk(req.body.id_organizacion); // Usar findByPk directamente desde el modelo
            if (!organizacion) {
                return res.status(404).json({ "state": false, "message": "Organización no encontrada" });
            }
            await evento.update(req.body);
            const fechaInicio = moment.utc(evento.fecha_inicio).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
            const fechaFin = moment.utc(evento.fecha_fin).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

            return res.status(200).json({ 
                "state": true, 
                "data": {
                    ...evento.toJSON(),
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                } 
            });
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }
};

module.exports = eventoController;
