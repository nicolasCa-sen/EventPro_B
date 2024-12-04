const { DataTypes } = require('sequelize');
const sequelize = require('../drivers/connect_db'); 

const Solicitud = sequelize.define('Solicitud', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios', 
      key: 'id'         
    }
  },
  id_organizacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  
},{
  tableName:'Solicitudes',
  timestamps: false 
});  

module.exports = Solicitud; 