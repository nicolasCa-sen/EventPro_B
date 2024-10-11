const Lugar=require('./../models/lugar')

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

};

module.exports = lugarController;
