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
        type: DataTypes.JSON,
        allowNull: true  
    },
    nombre: { 
        type: DataTypes.STRING(255), 
        allowNull: false,
        unique: true
    },
    modelo: { 
        type: DataTypes.STRING(100), 
        allowNull: false
    },
    unidad: { 
        type: DataTypes.ENUM('Unidad', 'Metros', 'Tramo 2 metros', 'Tramos 3 metros', 'Paquetes', 'Kit'), 
        defaultValue: 'Unidad'
    },
    precio: { 
        type: DataTypes.DECIMAL(10,2), 
        allowNull: false,
        validate: { min: 0 }
    },
    cantidad: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0, 
        validate: { min: 0 }
    },
    garantia: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    },
    iva: { 
        type: DataTypes.DECIMAL(5,2), 
        defaultValue: 19.00,
        validate: { isDecimal: true }
    },
    estado: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true // true = activo, false = inactivo
    }
});

// Relación con categorías
Product.belongsTo(Category, { foreignKey: 'id_categoria', as: 'categoria' });
Category.hasMany(Product, { foreignKey: 'id_categoria', as: 'productos' });

module.exports = Product;
