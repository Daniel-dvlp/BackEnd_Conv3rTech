const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const ServiceCategory = require('../services_categories/ServiceCategoriesModel');

const Service = sequelize.define('Service', {
    id_servicio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url_imagen: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    nombre_servicio: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    id_categoria_servicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ServiceCategory,
            key: 'id_categoria_servicio'
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    descripcion_servicio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}, {
    tableName: 'servicios',
    timestamps: false
});

// Relación con Categoría de Servicio
Service.belongsTo(ServiceCategory, {
    foreignKey: 'id_categoria_servicio'
});

module.exports = Service;
