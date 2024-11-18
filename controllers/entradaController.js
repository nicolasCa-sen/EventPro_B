const Entrada=require('./../models/entrada');
const Evento = require('./../models/evento');

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

};

module.exports = entradaController;
