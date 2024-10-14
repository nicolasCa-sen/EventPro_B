const Evento = require('./evento');
const Lugar = require('./lugar');

Lugar.hasMany(Evento, { foreignKey: 'id_lugar' });

Evento.belongsTo(Lugar, { foreignKey: 'id_lugar' });

module.exports = { Evento, Lugar};
