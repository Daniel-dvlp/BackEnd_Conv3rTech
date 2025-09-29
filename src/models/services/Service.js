const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const ServiceCategory = require('../services_categories/ServiceCategory');

const Service = sequelize.define('Service', {
    id_servicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    url_imagen: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
            isIn: [['activo', 'inactivo']]
        }
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    id_categoria_servicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ServiceCategory,
            key: 'id_categoria_servicio'
        }
    }
}, {
    tableName: 'servicios',
    timestamps: false
});

// RELACIÓN: Un servicio pertenece a una categoría
Service.belongsTo(ServiceCategory, {
    foreignKey: 'id_categoria_servicio',
    as: 'categoria'
});

// Una categoría puede tener varios servicios
ServiceCategory.hasMany(Service, {
    foreignKey: 'id_categoria_servicio',
    as: 'servicios'
});

module.exports = Service;
