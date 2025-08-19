const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Supplier = require('../supplier/SupplierModel');
const PurchaseDetail = require('./PurchaseDetailModel');

const Purchase = sequelize.define('Purchase', {
    id_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_recibo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'compositeIndex'
    },
    id_proveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'compositeIndex',
        references: {
            model: Supplier,
            key: 'id_proveedor'
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.ENUM('Registrada', 'Anulada', 'Completada'),
        defaultValue: 'Registrada'
    },
    fecha_recibo: {
        type: DataTypes.DATE,
        allowNull: false
    },
    iva: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    }
}, {
    tableName: 'compras',
    timestamps: false
});

// Definición de las asociaciones
Purchase.belongsTo(Supplier, { foreignKey: 'id_proveedor' });
Supplier.hasMany(Purchase, { foreignKey: 'id_proveedor' });

Purchase.hasMany(PurchaseDetail, { foreignKey: 'id_compra' });
PurchaseDetail.belongsTo(Purchase, { foreignKey: 'id_compra' });

module.exports = Purchase;
