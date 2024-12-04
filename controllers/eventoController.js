const Evento = require('./../models/evento');
const Lugar = require('./../models/lugar');
const Persona = require('./../models/persona');
const Entrada =require('./../models/entrada')
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const calculoentradas = async (id_lugar, fecha_inicio, fecha_fin) => {
    try {
        // Validar que las fechas sean válidas
        if (!fecha_inicio || !fecha_fin) {
            throw new Error("Fechas de inicio y fin son requeridas.");
        }

        const fechaInicio = new Date(fecha_inicio);
        const fechaFin = new Date(fecha_fin);

        if (isNaN(fechaInicio) || isNaN(fechaFin)) {
            throw new Error("Formato de fecha inválido.");
        }

        const lugar = await Lugar.findByPk(id_lugar);
        const aforo_max= parseInt(lugar.aforo_maximo);
        if (!lugar) {
            throw new Error("Evento no encontrado.");
        }

        // Calcular la duración en días
        let totalentradas=0;
        const duracion = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
        if(duracion > 1){
            const entradadias= ((duracion - 1) * 1.8);
            totalentradas=entradadias *aforo_max;
        }else{
            totalentradas = duracion * aforo_max;
        }
        return {
            totalentradas
        };
    } catch (error) {
        console.error("Error al calcular el nuemro de entradas totales:", error.message);
        throw error;  
    }
};


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
            const { cantidad_entradas, precio } = req.params; 
            const cantidadEntradas = parseInt(cantidad_entradas, 10);
            const precioEntradas = precio;

            if (isNaN(cantidadEntradas) || cantidadEntradas <= 0) {
                return res.status(400).json({ state: false, message: "Cantidad de entradas inválida" });
            }

            if (isNaN(precioEntradas) || precioEntradas <= 0) {
                return res.status(400).json({ state: false, message: "Precio inválido" });
            }
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
            if (req.body.fecha_inicio>req.body.fecha_fin) {
                return res.status(500).json({ state: false, message: "La fecha de inicio no puede ser posterior a la fecha de fin" });
            }
            const total=await calculoentradas(req.body.id_lugar,req.body.fecha_inicio,req.body.fecha_fin);
            if(cantidadEntradas>total.totalentradas){
                return res.status(500).json({ state: false, message: "el aforo maximo es de " + total.totalentradas });
            }

            const entradas = [];
            const evento = await Evento.create(eventoData);
            for (let i = 0; i < cantidadEntradas; i++) {
                entradas.push({
                    precio: precioEntradas,
                    disponible: true,
                    numero_ticket: i+1,
                    fecha_emision: null,
                    numero_recibo:null,
                    id_usuario: null,
                    id_evento: evento.id, 
                });
            }

            await Entrada.bulkCreate(entradas);

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
        upload.single('imagen_principal')(req, res, async (err) => {
            if (err) {
                console.error('Error al subir la imagen:', err);
                return res.status(400).json({ state: false, message: err.message });
            }
    
            try {
                const { id } = req.params;
                const evento = await Evento.findByPk(id);
    
                if (!evento) {
                    return res.status(404).json({ state: false, message: "Evento no encontrado" });
                }
    
                // Validar si el lugar existe
                const lugar = await Lugar.findByPk(req.body.id_lugar);
                if (!lugar) {
                    return res.status(404).json({ state: false, message: "Lugar no encontrado" });
                }
    
                // Validar si el creador existe y tiene permisos adecuados
                const creador = await Persona.findByPk(req.body.id_creador);
                if (!creador || creador.rol === "Usuario") {
                    return res.status(404).json({ state: false, message: "Creador del evento no encontrado" });
                }
    
                // Preparar datos para actualizar
                const datosActualizados = {
                    nombre: req.body.nombre,
                    descripcion: req.body.descripcion,
                    fecha_inicio: req.body.fecha_inicio,
                    fecha_fin: req.body.fecha_fin,
                    id_lugar: req.body.id_lugar,
                    activo: req.body.activo === 'true',
                    vendido: req.body.vendido === 'true',
                };
    
                // Si se cargó una nueva imagen, actualizar la URL
                if (req.file) {
                    datosActualizados.imagen_principal = `/uploads/${req.file.filename.replace(/\s+/g, '_')}`;
                }
    
                // Actualizar el evento
                await evento.update(datosActualizados);
    
                // Formatear fechas para la respuesta
                const fechaInicio = moment
                    .utc(evento.fecha_inicio)
                    .tz('America/Bogota')
                    .format('YYYY-MM-DD HH:mm:ss');
                const fechaFin = moment
                    .utc(evento.fecha_fin)
                    .tz('America/Bogota')
                    .format('YYYY-MM-DD HH:mm:ss');
    
                return res.status(200).json({
                    state: true,
                    data: {
                        ...evento.toJSON(),
                        fecha_inicio: fechaInicio,
                        fecha_fin: fechaFin,
                    },
                });
            } catch (error) {
                console.error('Error al actualizar el evento:', error);
                return res.status(500).json({ state: false, error: error.message });
            }
        });
    },
    
    deleteev: async (req, res) => {
        try {
            const { id } = req.params;
            const evento = await Evento.findByPk(id);

            if (!evento) {
                return res.status(404).json({ "state": false, "message": "Evento no encontrado" });
            }
            
            const fechaActual = new Date();
            const fechaFinEvento = new Date(evento.fecha_fin);

            if (fechaFinEvento >= fechaActual) {
                return res.status(400).json({ 
                    state: false, 
                    message: "No se puede eliminar un evento que aún no ha finalizado." 
                });
            }

            await Entrada.destroy({ where: { id_evento: id } });


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