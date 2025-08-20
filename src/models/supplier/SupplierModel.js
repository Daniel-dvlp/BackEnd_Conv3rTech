const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Supplier = sequelize.define('Supplier', {
    id_proveedor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nit: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    nombre_encargado: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    nombre_empresa: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
