const { DataTypes } = require('sequelize');
const sequelize = require('../drivers/connect_db'); 
const Evento = require('./evento')
const Organizacion = sequelize.define('Organizacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nit: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  }
  
},{
  tableName:'Organizaciones',
  timestamps: false 
});  

module.exports = Organizacion; 