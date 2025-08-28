const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AddressClients = sequelize.define('AddressClients', {
  id_direccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_direccion: {
    type: DataTypes.STRING(100),
    allowNull: false
 },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
  },
  {
      tableName: 'direcciones_clientes',
      timestamps: false
  
 });

 module.exports = AddressClients;