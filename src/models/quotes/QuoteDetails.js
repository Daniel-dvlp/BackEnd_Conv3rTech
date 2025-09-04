const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Quote = require('./Quote');
const Productp = require('../../models/products/Product');
const Service = require('../../models/services/Service'); 

const QuoteDetail = sequelize.define('QuoteDetail', {
    id_detalle_cot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_cotizacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_servicio: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'detalles_cotizacion',
    timestamps: false
});

// 🔗 Relaciones
QuoteDetail.belongsTo(Quote, { foreignKey: 'id_cotizacion', as: 'cotizacion' });
Quote.hasMany(QuoteDetail, { foreignKey: 'id_cotizacion', as: 'detalles' });

QuoteDetail.belongsTo(Productp, { foreignKey: 'id_producto', as: 'producto' });
Productp.hasMany(QuoteDetail, { foreignKey: 'id_producto', as: 'detalles_cotizacion' });

QuoteDetail.belongsTo(Service, { foreignKey: 'id_servicio', as: 'servicio' });
Service.hasMany(QuoteDetail, { foreignKey: 'id_servicio', as: 'detalles_cotizacion' });

module.exports = QuoteDetail;
