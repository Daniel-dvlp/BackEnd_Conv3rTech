const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Sale = require('./Sale'); // Modelo de ventas
const Product = require('../products/Product'); // Modelo de productos

const SaleDetail = sequelize.define('SaleDetail', {
    id_detalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_venta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    subtotal_producto: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 }
    }
}, {
    tableName: 'detalle_venta_productos',
    timestamps: false
});

// 🔗 Relaciones
SaleDetail.belongsTo(Sale, { foreignKey: 'id_venta', as: 'venta' });
Sale.hasMany(SaleDetail, { foreignKey: 'id_venta', as: 'detalles' });

SaleDetail.belongsTo(Product, { foreignKey: 'id_producto', as: 'producto' });
Product.hasMany(SaleDetail, { foreignKey: 'id_producto', as: 'detalles_venta' });

module.exports = SaleDetail;
