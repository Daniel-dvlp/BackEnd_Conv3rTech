const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Product = require('./Product');
const Feature = require('./Feature');

const Datasheet = sequelize.define('Datasheet', {
    id_ficha_tecnica: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_caracteristica: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'fichas_tecnicas',
    timestamps: false
});

// Relaciones
Datasheet.belongsTo(Product, { foreignKey: 'id_producto', onDelete: 'CASCADE' });
Product.hasMany(Datasheet, { foreignKey: 'id_producto' });

Datasheet.belongsTo(Feature, { foreignKey: 'id_caracteristica' });
Feature.hasMany(Datasheet, { foreignKey: 'id_caracteristica' });

module.exports = Datasheet;
