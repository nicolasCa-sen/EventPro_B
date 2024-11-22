const Evento = require('./../models/evento');
const Lugar = require('./../models/lugar');
const Persona = require('./../models/persona');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen.'));
        }
    },
});
const eventoController = {
    save: async (req, res) => {
    upload.single('imagen_principal')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir la imagen:', err);
            return res.status(400).json({ state: false, message: err.message });
        }

        try {
            const lugar = await Lugar.findByPk(req.body.id_lugar);
            const creador = await Persona.findByPk(req.body.id_creador);

            if (!lugar) {
                return res.status(404).json({ state: false, message: "Lugar no encontrado" });
            }
            if (!creador || creador.rol === "Usuario") {
                return res.status(404).json({ state: false, message: "Creador del evento no encontrado" });
            }

            // Eliminar los espacios y asegurar que no haya doble slash en la URL
            const imagenPrincipal = req.file 
                ? `/uploads/${req.file.filename.replace(/\s+/g, '_').replace(/^\/+/, '')}`  // Reemplazamos los espacios por "_"
                : null;

            const eventoData = {
                ...req.body,
                imagen_principal: imagenPrincipal, // Guardamos la URL corregida
            };

            const evento = await Evento.create(eventoData);

            return res.status(200).json({ state: true, data: evento });
        } catch (error) {
            console.error('Error al guardar un evento:', error);
            return res.status(500).json({ state: false, error: error.message });
        }
    });
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
            const creador =await Persona.findByPk(req.body.id_creador);
            if (!creador || creador.rol==="Usuario") {
                return res.status(404).json({ "state": false, "message": "Creador del evento no encontrado" });
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
    },
    deleteev: async (req, res) => {
        try {
            const { id } = req.params;
            const evento = await Evento.findByPk(id);

            if (!evento) {
                return res.status(404).json({ "state": false, "message": "Evento no encontrado" });
            }

            await evento.destroy();
            return res.status(200).json({ "state": true, "message": "Evento eliminado correctamente" });
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    select: async (req, res) => {
        try {
            const eventos = await Evento.findAll();

            return res.status(200).json({
                "state": true,
                "data": eventos
            });
        } catch (error) {
            console.error('Error al obtener los eventos:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }
};
module.exports = eventoController;