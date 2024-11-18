const { DataTypes } = require('sequelize');
const sequelize = require('../drivers/connect_db');


const Persona = sequelize.define('Persona', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  identificacion: {
    type: DataTypes.STRING,
    unique:true,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  numero_cuenta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numero_credencial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_organizacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Organizaciones', 
      key: 'id'         
    }
  }
}, {
  tableName: 'Usuarios',
  timestamps: false
});

module.exports = Persona;
