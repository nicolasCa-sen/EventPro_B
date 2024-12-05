const Persona=require('./../models/persona');
const Solicitud=require('./../models/solicitud');
const { differenceInYears } = require('date-fns');
const { Op } = require('sequelize');

rolNecesario="Usuario";

const usuarioController = {

 findByEmail : async (req, res) => {
        try {
            const { email } = req.body; // Obtén el correo electrónico del cuerpo de la solicitud
    
            if (!email) {
                return res.status(400).json({
                    state: false,
                    message: "Correo electrónico es obligatorio"
                });
            }
    
            // Buscar al usuario por su correo electrónico
            const usuario = await Persona.findOne({
                where: { email: { [Op.eq]: email } } // Usamos Op.eq para comparar exactamente el correo
            });
    
            if (!usuario) {
                return res.status(404).json({
                    state: false,
                    message: "Usuario no encontrado"
                });
            }
    
            console.log(usuario.id);
            // Si el usuario existe, devolver el id
            return res.status(200).json({
                state: true,
                id: usuario.id // Retornamos solo el id
            });
        } catch (error) {
            console.error('Error al buscar el usuario por correo:', error);
            return res.status(500).json({
                state: false,
                error: error.message
            });
        }
    },
    
    
    
    registrarse: async (req, res) => {
        try {
            const { rol } = req.body;  // Obtén el rol desde el cuerpo de la solicitud
            
            if(rol !== 'Usuario') {  // Asegúrate de que el rol recibido sea válido
                return res.status(400).json({ "state": false, "error": 'Rol no válido' });
            }
   
            req.body.numero_cuenta = null;
            req.body.numero_credencial = null;
            req.body.id_organizacion = null;
   
            const fecha_nacimiento = new Date(req.body.fecha_nacimiento);
            const edad = differenceInYears(new Date(), fecha_nacimiento);
   
            if (edad < 18) {
                return res.status(400).json({ "state": false, "error": "Debe ser mayor de edad para registrarse." });
            }
   
            const usuario = await Persona.create(req.body);
            return res.status(200).json({ "state": true, "data": usuario });
        } catch (error) {
            console.error('Error al Registrar el usuario:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    solicitudCredencial: async(req,res)=>{
        try {
            const { id_usuario, id_organizacion } = req.body;
            const usuario = await Persona.findByPk(id_usuario);

            if (!usuario) {
                return res.status(404).json({
                    state: false,
                    message: "Usuario no encontrado",
                });
            }
            const nuevaSolicitud = await Solicitud.create({
                id_usuario,
                id_organizacion,
            });

            return res.status(200).json({
                state: true,
                message: "Solicitud realizada",
                data: nuevaSolicitud,
            });
        } catch (error) {
            console.error('Error en la solicitud de cambio de credenciales:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },

    select: async (req, res) => {
        try {
            // Buscar todos los usuarios con el rol 'Usuario'
            const usuarios = await Persona.findAll({
                where: { rol: 'Usuario' }, // Filtrar por rol 'Usuario'
                attributes: {
                    exclude: ['contraseña', 'telefono', 'numero_cuenta', 'numero_credencial'] // Excluir campos privados
                }
            });
    
            // Verificar si se encontraron usuarios
            if (usuarios.length === 0) {
                return res.status(404).json({ 
                    "state": false, 
                    "message": "No se encontraron usuarios." 
                });
            }
    
            // Enviar respuesta exitosa con los usuarios encontrados
            return res.status(200).json({
                "state": true,
                "data": usuarios
            });
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return res.status(500).json({ 
                "state": false, 
                "error": error.message 
            });
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
    deleteus: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Persona.findByPk(id);

            if (!usuario || usuario.rol!== "Usuario") {
                return res.status(404).json({ "state": false, "message": "Usuario no encontrado" });
            }
         
            await usuario.destroy();
            return res.status(200).json({ "state": true, "message": "Usuario eliminado correctamente" });
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }

};

module.exports = usuarioController;
