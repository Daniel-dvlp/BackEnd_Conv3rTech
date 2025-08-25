const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Feature = sequelize.define('Feature', {
    id_caracteristica: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nombre: { 
        type: DataTypes.STRING(100), 
        allowNull: false, 
        unique: true 
    }
});

module.exports = Feature;
