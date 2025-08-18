const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AddressClients = sequelize.define('AddressClients', {
  id_address: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_client:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nameAddress: {
    type: DataTypes.STRING(100),
    allowNull: false
 },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
 });

 module.exports = AddressClients;