const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para almacenar archivos en el servidor
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, './uploads'); // Directorio para guardar imágenes
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Crea el directorio si no existe
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Nombre único para cada archivo
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño de archivo a 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen.'));
        }
    },
});

// Método `save`
const save = async (req, res) => {
    try {
        // Procesar la carga del archivo
        upload.single('imagen_principal')(req, res, async (err) => {
            if (err) {
                console.error('Error al subir la imagen:', err);
                return res.status(400).json({ state: false, message: err.message });
            }

            const lugar = await Lugar.findByPk(req.body.id_lugar);
            const creador = await Persona.findByPk(req.body.id_creador);

            if (!lugar) {
                return res.status(404).json({ state: false, message: "Lugar no encontrado" });
            }

            if (!creador || creador.rol === "Usuario") {
                return res.status(404).json({ state: false, message: "Creador del evento no encontrado" });
            }

            // Crear evento con los datos
            const eventoData = {
                ...req.body,
                imagen_principal: req.file ? `/uploads/${req.file.filename}` : null, // Ruta de la imagen subida
            };

            const evento = await Evento.create(eventoData);

            return res.status(200).json({ state: true, data: evento });
        });
    } catch (error) {
        console.error('Error al guardar un evento:', error);
        return res.status(500).json({ state: false, error: error.message });
    }
};

module.exports = { save };
