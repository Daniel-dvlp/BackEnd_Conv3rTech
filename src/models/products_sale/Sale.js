const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Client = require('../clients/Clients'); // asegúrate de que ya tienes este modelo

const Sale = sequelize.define('Sale', {
    id_venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_venta: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true // correlativo único
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_venta: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    metodo_pago: {
        type: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Registrada', 'Anulada'),
        defaultValue: 'Registrada'
    },
    motivo_anulacion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    subtotal_venta: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    monto_iva: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    monto_venta: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0 }
    }
}, {
    tableName: 'venta_productos',
    timestamps: false
});

// 🔗 Relación con clientes
Sale.belongsTo(Client, { foreignKey: 'id_cliente', as: 'cliente' });
Client.hasMany(Sale, { foreignKey: 'id_cliente', as: 'ventas' });

module.exports = Sale;
