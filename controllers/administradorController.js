const Persona=require('./../models/persona');
const Organizacion=require('./../models/organizacion');
const { differenceInYears } = require('date-fns');
rolCredencial="Organizador";
rolActual="Usuario";

const adminController = {
    cambioCredenciales: async (req, res) => {
        try {
            const { id_usuario,id_organizacion } = req.body;
            const usuario = await Persona.findByPk(id_usuario);
            const existeOrganizacion = await Organizacion.findByPk(id_organizacion);

            if (!usuario || usuario.rol !== rolActual) {
                return res.status(404).json({ "state": false, "message": "Usuario no encontrado" });
            }
            if(!existeOrganizacion){
                return res.status(404).json({ "state": false, "message": "La organizacion no existe "});
            }
            await Persona.update(
                {
                    numero_cuenta: null,
                    numero_credencial: null,
                    rol: rolCredencial,
                    id_organizacion: id_organizacion,
                },
                {
                    where: { id: id_usuario }, 
                }
            )
            const usuarioActualizado = await Persona.findByPk(id_usuario);

            return res.status(200).json({ "state": true, "data": usuarioActualizado});
        } catch (error) {
            console.error('Error al generar las credenciales:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }

};
module.exports = adminController;

