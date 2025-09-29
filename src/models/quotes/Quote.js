const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Client = require('../../models/clients/Clients');

const Quote = sequelize.define('Quote', {
    id_cotizacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_cotizacion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    subtotal_productos: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    subtotal_servicios: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    monto_iva: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    monto_cotizacion: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        validate: { min: 0 }
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada'),
        allowNull: false,
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'cotizaciones',
    timestamps: false
});

// 🔗 Relación con clientes
Quote.belongsTo(Client, { foreignKey: 'id_cliente', as: 'cliente' });
Client.hasMany(Quote, { foreignKey: 'id_cliente', as: 'cotizaciones' });

module.exports = Quote;
