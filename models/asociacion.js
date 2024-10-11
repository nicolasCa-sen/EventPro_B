const Evento = require('./evento');
const Lugar = require('./lugar');
const Organizacion = require('./organizacion');


Organizacion.hasMany(Evento, { foreignKey: 'id_organizacion' });
Lugar.hasMany(Evento, { foreignKey: 'id_lugar' });

Evento.belongsTo(Lugar, { foreignKey: 'id_lugar' });
Evento.belongsTo(Organizacion, { foreignKey: 'id_organizacion' });

module.exports = { Evento, Lugar, Organizacion };
