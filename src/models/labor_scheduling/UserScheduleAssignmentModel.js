const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UserScheduleAssignment = sequelize.define('UserScheduleAssignment', {
    id_asignacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_horario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'id_schedule'
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id_usuario'
        }
    },
    estado: {
        type: DataTypes.ENUM('Asignado', 'Confirmado', 'Rechazado', 'Completado', 'Ausente'),
        allowNull: false,
        defaultValue: 'Asignado'
    },
    notas_asignacion: {
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
    tableName: 'user_schedule_assignments',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id_horario', 'id_usuario']
        },
        {
            fields: ['estado']
        },
        {
            fields: ['fecha_creacion']
        }
    ]
});

UserScheduleAssignment.associate = (models) => {
    UserScheduleAssignment.belongsTo(models.Schedule, {
        foreignKey: 'id_horario',
        as: 'schedule'
    });
    UserScheduleAssignment.belongsTo(models.User, {
        foreignKey: 'id_usuario',
        as: 'user'
    });
};

module.exports = UserScheduleAssignment;