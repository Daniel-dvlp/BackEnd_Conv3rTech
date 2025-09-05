const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Product = require('../products/Product'); // Ruta y nombre de archivo corregidos

const PurchaseDetail = sequelize.define('PurchaseDetail', {
    id_detalle_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_compra: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal_producto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'detalles_compras',
    timestamps: false
});

// Definimos la asociación unilateral desde PurchaseDetail a Product
// No necesitamos modificar el modelo de Producto, solo lo importamos aquí
PurchaseDetail.belongsTo(Product, {
    foreignKey: 'id_producto',
    as: 'product'
});

module.exports = PurchaseDetail;