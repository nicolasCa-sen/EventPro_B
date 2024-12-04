const Entrada=require('./../models/entrada');
const Evento = require('./../models/evento');
const Usuario= require('./../models/persona');
const crypto = require('crypto');

function generarRecibo() {
    // Generar un buffer aleatorio de 6 bytes y convertirlo en una cadena alfanumérica en base64
    const randomBytes = crypto.randomBytes(6).toString('base64');
    // Reemplazar caracteres no alfanuméricos si es necesario
    return randomBytes.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10); // Limitamos a 10 caracteres
}
const entradaController = {
    save: async (req, res) => {
        try {
            const evento=await Evento.findByPk(req.body.id_evento);
            if(!evento){
                return res.status(404).json({"state":false,"error":"El evento no existe"})
            }
            req.body.disponible=true;
            req.body.numero_recibo=null;
            req.body.fecha_emision=null;
            req.body.id_usuario=null;
            const entrada = await Entrada.create(req.body);
            return res.status(200).json({ "state": true, "data": entrada });
        } catch (error) {
            console.error('Error al guardar la entrada:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    findById: async (req, res) => {
        try {
            const entrada = await  Entrada.findByPk(req.params.id); 

            if (!entrada) {
                return res.status(404).json({ "state": false, "message": "La entrada no existe" });
            }

            return res.status(200).json({ "state": true, "data": entrada });
        } catch (error) {
            console.error('Error al encontrar la entrada:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    cambiosSinCompra: async (req, res) => {
        try {
            const { id } = req.params;
            const entrada = await Entrada.findByPk(id);

            if (!entrada) {
                return res.status(404).json({ "state": false, "message": "La entrada no existe" });
            }
            const evento=await Evento.findByPk(req.body.id_evento);
            if(!evento){
                return res.status(404).json({"state":false,"error":"El evento no existe"})
            }
            req.body.disponible=true;
            req.body.numero_recibo=null;
            req.body.fecha_emision=null;
            req.body.id_usuario=null;
            
            await Entrada.update(req.body,{where:{id}});
            const entradaActualizada= await Entrada.findByPk(id);
            return res.status(200).json({ "state": true, "data": entradaActualizada });
        } catch (error) {
            console.error('Error al actualizar la entrada:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    cambiosVenta: async (req,res)=>{
        try{

        const { cantidad, id_usuario, id_evento } = req.body;
        if(!cantidad || cantidad<=0){
            return res.status(400).json({"state":false,"message":"La cantidad de entradas no puede ser negativa o 0"});
        }
        const usuario= await Usuario.findByPk(req.body.id_usuario);
        if (!usuario) {
            return res.status(404).json({ "state": false, "message": "El usuario no existe" });
        }
        const evento=await Evento.findByPk(req.body.id_evento);
        if(!evento){
            return res.status(404).json({"state":false,"error":"El evento no existe"});
        }
        
        // Obtener las entradas disponibles para el evento
        const entradasDisponibles = await Entrada.findAll({
            where: {
                id_evento: id_evento,
                disponible: true,
            },
            order: [['id', 'ASC']], 
            limit: cantidad, 
        });

        // Verificar si hay suficientes entradas disponibles
        if (entradasDisponibles.length < cantidad) {
            return res.status(400).json({"state": false,"message": `No hay suficientes entradas disponibles.
                 Disponibles: ${entradasDisponibles.length}`,});
        }
        const recibo= generarRecibo();
        const fecha= new Date();

        const Actualizar = entradasDisponibles.map((entrada) => entrada.id);
        await Entrada.update(
            {
                disponible: false,
                id_usuario: id_usuario,
                numero_recibo:recibo,
                fecha_emision:fecha
            },
            {
                where: {
                    id: Actualizar,
                },
            }
        );

        // Devolver una respuesta exitosa
        return res.status(200).json({
            "state": true,
            "message": `Se actualizaron ${cantidad} entradas correctamente`,
            "data": Actualizar,
        });
        }catch (error){
            console.error('Error al actualizar las entradas:', error);
            return res.status(500).json({
                "state": false,
                "message": "Error interno del servidor",
                "error": error.message,
            });
        }
    },
    select: async (req, res) => {
        try {
            const entradas = await Entrada.findAll();

            return res.status(200).json({
                "state": true,
                "data": entradas
            });
        } catch (error) {
            console.error('Error al obtener las entradas:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    obtenerPrecio:async(req,res)=>{
        try{
            const {id_evento}=req.params;
            const entrada=await Entrada.findOne({where: {id_evento:id_evento}});
            if (!entrada) {
                return res.status(404).json({ state: false, message: "No se encontró ninguna entrada para este evento." });
            }
            const precio=entrada.precio;
            return res.status(200).json({"state":true,"data":precio})
        }catch(error){
            console.error('Error al obtener el precio:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    },
    obtenerTotal :async(req,res)=>{
        try{
            const {id_evento,num_entradas}=req.body;
            const entrada=await Entrada.findOne({where: {id_evento:id_evento}});
            if (!entrada) {
                return res.status(404).json({ state: false, message: "No se encontró ninguna entrada para este evento." });
            }
            const precio=entrada.precio;
            const total=(precio* num_entradas)
            return res.status(200).json({"state":true,"data":total})

        }catch(error){
            console.error('Error al calcular el total:', error);
            return res.status(500).json({ "state": false, "error": error.message });
        }
    }

};

module.exports = entradaController;
