const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ShiftInstance = sequelize.define('ShiftInstance', {
    id_instancia_turno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_plantilla_turno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'plantillas_turnos',
            key: 'id_plantilla_turno'
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    duracion_horas: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Programado', 'En progreso', 'Completado', 'Cancelado'),
        allowNull: false,
        defaultValue: 'Programado'
    },
    calendar_event_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'ID del evento en Google Calendar'
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'instancias_turnos',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id_plantilla_turno', 'fecha', 'hora_inicio']
        }
    ]
});

ShiftInstance.associate = (models) => {
    ShiftInstance.belongsTo(models.ShiftTemplate, {
        foreignKey: 'id_plantilla_turno',
        as: 'template'
    });
    ShiftInstance.hasMany(models.EmployeeShiftAssignment, {
        foreignKey: 'id_instancia_turno',
        as: 'assignments'
    });
};

module.exports = ShiftInstance;