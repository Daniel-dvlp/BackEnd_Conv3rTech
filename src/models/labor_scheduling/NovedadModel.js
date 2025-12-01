const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Programacion = require('./ProgramacionModel');
const User = require('../users/Users');

const Novedad = sequelize.define('Novedad', {
    id_novedad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id_usuario',
        },
    },
    programacion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Programacion,
            key: 'id_programacion',
        },
    },
    titulo: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    all_day: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: '#EF4444',
        validate: {
            is: /^#[0-9A-F]{6}$/i,
        },
    },
    estado: {
        type: DataTypes.ENUM('Activa', 'Inactiva'),
        defaultValue: 'Activa',
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'novedades',
    timestamps: false,
});

Novedad.associate = (models) => {
    Novedad.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'usuario',
    });
    Novedad.belongsTo(models.Programacion, {
        foreignKey: 'programacion_id',
        as: 'programacion',
    });
};

module.exports = Novedad;
