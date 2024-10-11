const { DataTypes } = require('sequelize');
const sequelize = require('../drivers/connect_db');


const Evento = sequelize.define('Evento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  imagen_principal: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  vendido: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  id_lugar: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Lugares', 
      key: 'id'         
    }
  },
  id_organizacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Organizaciones', 
      key: 'id'                
    }
  }
}, {
  tableName: 'Eventos',
  timestamps: false
});



module.exports = Evento;
