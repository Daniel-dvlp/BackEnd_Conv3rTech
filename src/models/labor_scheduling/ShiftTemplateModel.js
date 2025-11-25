const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ShiftTemplate = sequelize.define('ShiftTemplate', {
    id_plantilla_turno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100]
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
    },
    color: {
        type: DataTypes.STRING(7), // Hex color code
        allowNull: true,
        validate: {
            is: /^#[0-9A-F]{6}$/i
        }
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'plantillas_turnos',
    timestamps: false
});

ShiftTemplate.associate = (models) => {
    ShiftTemplate.hasMany(models.ShiftTimeSlot, {
        foreignKey: 'id_plantilla_turno',
        as: 'timeSlots'
    });
    ShiftTemplate.hasMany(models.ShiftInstance, {
        foreignKey: 'id_plantilla_turno',
        as: 'instances'
    });
};

module.exports = ShiftTemplate;