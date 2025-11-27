const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ShiftTimeSlot = sequelize.define('ShiftTimeSlot', {
    id_ranura_tiempo: {
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
    dia_semana: {
        type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
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
        allowNull: false,
        defaultValue: 8.00
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ranuras_tiempo_turnos',
    timestamps: false
});

ShiftTimeSlot.associate = (models) => {
    ShiftTimeSlot.belongsTo(models.ShiftTemplate, {
        foreignKey: 'id_plantilla_turno',
        as: 'template'
    });
};

module.exports = ShiftTimeSlot;