const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Feature = require('./Feature');

const DataSheet = sequelize.define('DataSheet', {
    id_ficha_tecnica: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    value: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    }
});

// Relaciones
DataSheet.belongsTo(Product, { foreignKey: 'id_producto', onDelete: 'CASCADE' });
Product.hasMany(DataSheet, { foreignKey: 'id_producto' });

DataSheet.belongsTo(Feature, { foreignKey: 'id_caracteristica' });
Feature.hasMany(DataSheet, { foreignKey: 'id_caracteristica' });

module.exports = DataSheet;
