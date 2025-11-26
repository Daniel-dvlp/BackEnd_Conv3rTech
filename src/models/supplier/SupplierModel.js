const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Supplier = sequelize.define('Supplier', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nit: {
        type: DataTypes.STRING(30),
        allowNull: true,
        validate: {
            isAlphanumeric: true
        }
    },
    nombre_encargado: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    nombre_empresa: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    telefono_entidad: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            is: /^[0-9+\-\s()]+$/i
        }
    },
    telefono_encargado: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[0-9+\-\s()]+$/i
        }
    },
    correo_principal: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    correo_secundario: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
    },
    observaciones: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'proveedores',
    timestamps: false
});

module.exports = Supplier;
