const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ServiceCategory = sequelize.define('ServiceCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_categoria_servicio'
    },
    url_imagen: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false
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
    }
}, {
    tableName: 'categorias_servicios',
    timestamps: false
});

// La relación con el modelo 'Service' ha sido removida para que este archivo sea independiente.

module.exports = ServiceCategory;