const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
// Se ha eliminado la línea que requería PurchaseModel para evitar dependencias circulares.

// Definición del modelo para la tabla 'detalles_compras'
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

module.exports = PurchaseDetail;
