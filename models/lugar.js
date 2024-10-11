const { DataTypes } = require('sequelize');
const sequelize = require('../drivers/connect_db'); 
const Evento=require('./evento')

const Lugar = sequelize.define('Lugar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_escenario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
},{
  tableName:'Lugares',
  timestamps: false 
});


module.exports = Lugar;
