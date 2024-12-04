const Organizacion=require('./../models/organizacion')
const Persona =require('./../models/persona')

const organizacionController = {
    save: async (req, res) => {
        try {
            const organizacion = await Organizacion.create(req.body);
            return res.status(200).json({ "state": true, "data": organizacion });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ "state": false, "message": "El NIT de la organizacion ya existe." });
            }
            console.error('Error al guardar una organizacion:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const organizacion = await Organizacion.findByPk(req.params.id); 

            if (!organizacion) {
                return res.status(404).json({ "state": false, "message": "Organizacion no encontrada" });
            }

            return res.status(200).json({ "state": true, "data": organizacion });
        } catch (error) {
            console.error('Error al obtener organizacion:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const organizacion = await Organizacion.findByPk(id);

            if (!organizacion) {
                return res.status(404).json({ "state": false, "message": "Organizacion no encontrada" });
            }
            if (req.body.nit) {
                const existingNit = await Organizacion.findOne({ where: { nit: req.body.nit } });
                if (existingNit && existingNit.id !== id) {
                    return res.status(400).json({ "state": false, "message": "El NIT ya existe." });
                }
            }
            await organizacion.update(req.body);
            return res.status(200).json({ "state": true, "data": organizacion });
        } catch (error) {
            console.error('Error al actualizar la organizacion:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    select: async (req, res) => {
        try {
            const organizaciones = await Organizacion.findAll();

            return res.status(200).json({
                "state": true,
                "data": organizaciones
            });
        } catch (error) {
            console.error('Error al obtener las organizaciones:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    deleteor: async (req, res) => {
        try {
            const { id } = req.params;
            const organizacion = await Organizacion.findByPk(id);

            if (!organizacion) {
                return res.status(404).json({ "state": false, "message": "Organizacion no encontrada" });
            }
        
            const organizadoresAsociados = await Persona.findOne({
                where: {
                    id_organizacion: id,
                }
            });
    
            if (organizadoresAsociados) {
                return res.status(400).json({ 
                    "state": false, 
                    "message": "No se puede eliminar una organizacion asociada con organizadores." });
            }
            await organizacion.destroy();
            return res.status(200).json({ "state": true, "message": "Organizacion eliminada correctamente" });
        } catch (error) {
            console.error('Error al eliminar la organizacion:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }

};

module.exports = organizacionController;
