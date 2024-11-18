const Evento = require('./evento');
const Lugar = require('./lugar');
const Organizacion = require('./organizacion');
const Persona = require('./persona');

Lugar.hasMany(Evento, { foreignKey: 'id_lugar' });

Evento.belongsTo(Lugar, { foreignKey: 'id_lugar' });

Persona.hasMany(Evento, { foreignKey: 'id_creador' });

Evento.belongsTo(Persona, { foreignKey: 'id_creador' });

Organizacion.hasMany(Persona,{foreignKey:'id_organizacion'});

Persona.belongsTo(Organizacion,{foreignKey:'id_organizacion'});

module.exports = { Evento, Lugar};
