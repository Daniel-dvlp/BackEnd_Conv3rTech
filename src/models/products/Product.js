const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Category = require('../products_category/ProductsCategory');

const Product = sequelize.define('Product', {
    id_producto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fotos: {
        type: DataTypes.JSON, // se guardan como array en PostgreSQL
        allowNull: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unidad_medida: {
        type: DataTypes.ENUM('unidad', 'metros', 'tramo 2 metros', 'tramo 3 metros', 'paquetes', 'kit'),
        defaultValue: 'unidad'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 }
    },
    garantia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 12 }
    },
    codigo_barra: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true // true = activo, false = inactivo
    },
}, {
    tableName: 'productos',
    timestamps: false
});

// Relación con categorías
Product.belongsTo(Category, { foreignKey: 'id_categoria', as: 'categoria' });
Category.hasMany(Product, { foreignKey: 'id_categoria', as: 'productos' });

module.exports = Product;
