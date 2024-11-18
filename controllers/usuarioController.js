const Persona=require('./../models/persona');
const { differenceInYears } = require('date-fns');
rolNecesario="Usuario";

const usuarioController = {
    
    registrarse: async (req, res) => {
        try {
            if(req.body.rol=== rolNecesario){
                req.body.numero_cuenta=null;
                req.body.numero_credencial=null;
                req.body.id_organizacion=null;
                const fecha_nacimiento = new Date(req.body.fecha_nacimiento);
                const edad = differenceInYears(new Date(), fecha_nacimiento);

                if (edad < 18) {
                    return res.status(400).json({ "state": false, "error": "Debe ser mayor de edad para registrarse." });
                }              
                const usuario = await Persona.create(req.body);
                return res.status(200).json({ "state": true, "data": usuario });
            }else{
                return res.status(400).json({ "state": false, "error": 'rol no valido' });  
            }
 
        } catch (error) {
            console.error('Error al Registrar el usuario:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

    findById: async (req, res) => {
        try {
            
            const usuario = await  Persona.findByPk(req.params.id); 

            if (!usuario || usuario.rol!== "Usuario") {
                return res.status(404).json({ "state": false, "message": "Usuario no encontrado" });
            }

            return res.status(200).json({ "state": true, "data": usuario });
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    updateUsuario: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Persona.findByPk(id);

            if (!usuario || usuario.rol !== rolNecesario) {
                return res.status(404).json({ "state": false, "message": "Usuario no encontrado" });
            }
            req.body.numero_cuenta=null;
            req.body.numero_credencial=null;
            req.body.id_organizacion=null;
            await Persona.update(req.body,{where: {id}});
            const usuarioActualizado = await Persona.findByPk(id);

            return res.status(200).json({ "state": true, "data": usuarioActualizado});
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

};

module.exports = usuarioController;
