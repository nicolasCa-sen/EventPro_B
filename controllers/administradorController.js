const Persona=require('./../models/persona');
const Organizacion=require('./../models/organizacion');
const { differenceInYears } = require('date-fns');
rolCredencial="Organizador";
rolActual="Usuario";

const adminController = {
    cambioCredenciales: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Persona.findByPk(id);
            const existeOrganizacion = await Organizacion.findByPk(req.body.id_organizacion);

            if (!usuario || usuario.rol !== rolActual) {
                return res.status(404).json({ "state": false, "message": "Usuario no encontrado" });
            }
            if(req.body.id_organizacion === null){
                return res.status(404).json({ "state": false, "message": "Debe estar asociado a una organizacion"});
            }
            if(!existeOrganizacion){
                return res.status(404).json({ "state": false, "message": "La organizacion no existe "});
            }
            req.body.numero_cuenta=null;
            req.body.numero_credencial=null;
            req.body.rol=rolCredencial;
            await Persona.update(req.body,{where: {id}});
            const usuarioActualizado = await Persona.findByPk(id);

            return res.status(200).json({ "state": true, "data": usuarioActualizado});
        } catch (error) {
            console.error('Error al generar las credenciales:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }

};
module.exports = adminController;

