const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/Users');

const Programacion = sequelize.define('Programacion', {
    id_programacion: {
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
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    titulo: {
        type: DataTypes.STRING(120),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        defaultValue: '#2563EB',
        validate: {
            is: /^#[0-9A-F]{6}$/i,
        },
    },
    dias: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Objeto { lunes: [{horaInicio, horaFin, subtitulo?, color?}], ... }',
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
    tableName: 'programaciones',
    timestamps: false,
});

Programacion.associate = (models) => {
    Programacion.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'usuario',
    });
};

module.exports = Programacion;


