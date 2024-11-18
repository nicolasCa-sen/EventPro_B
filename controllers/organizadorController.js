const Persona=require('./../models/persona');
const Organizacion=require('./../models/organizacion');
rolNecesario="Organizador";

const organizadorController = {

    findById: async (req, res) => {
        try {
            
            const organizador = await  Persona.findByPk(req.params.id); 

            if (!organizador || organizador.rol!== rolNecesario) {
                return res.status(404).json({ "state": false, "message": "Organizador no encontrado" });
            }

            return res.status(200).json({ "state": true, "data": organizador });
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    updateOrganizador: async (req, res) => {
        try {
            const { id } = req.params;
            const organizador = await Persona.findByPk(id);
            const existeOrganizacion = await Organizacion.findByPk(req.body.id_organizacion);
            if (!organizador || organizador.rol !== rolNecesario) {
                return res.status(404).json({ "state": false, "message": "Organizador no encontrado" });
            }
            if(req.body.id_organizacion === null){
                return res.status(404).json({ "state": false, "message": "Debe estar asociado a una organizacion"});
            }
            if(!existeOrganizacion){
                return res.status(404).json({ "state": false, "message": "La organizacion no existe "});
            }
            req.body.numero_cuenta=null;
            req.body.numero_credencial=null;
            await Persona.update(req.body,{where: {id}});
            const organizadorActualizado = await Persona.findByPk(id);

            return res.status(200).json({ "state": true, "data": organizadorActualizado});
        } catch (error) {
            console.error('Error al actualizar el organizador:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

};

module.exports = organizadorController;
