const { DataTypes } = require('sequelize');
const sequelize = require('../drivers/connect_db');


const Entrada = sequelize.define('Entrada', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  precio: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  asiento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  fecha_emision: {
    type: DataTypes.DATE,
    allowNull: true
  },
  numero_recibo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_evento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Eventos', 
      key: 'id'         
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Usuarios', 
      key: 'id'         
    }
  }
}, {
  tableName: 'Entradas',
  timestamps: false
});



module.exports = Entrada;
