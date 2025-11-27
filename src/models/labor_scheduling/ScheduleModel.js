const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Schedule = sequelize.define('Schedule', {
    id_schedule: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo: {
        type: DataTypes.ENUM('recurring', 'one-time'),
        allowNull: false,
        validate: {
            isIn: [['recurring', 'one-time']]
        }
    },
    // Fields for recurring schedules
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isRequiredForRecurring(value) {
                if (this.tipo === 'recurring' && !value) {
                    throw new Error('fecha_inicio is required for recurring schedules');
                }
            }
        }
    },
    recurrencia_semanal: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isArray(value) {
                if (value && !Array.isArray(value)) {
                    throw new Error('recurrencia_semanal must be an array');
                }
            },
            isRequiredForRecurring(value) {
                if (this.tipo === 'recurring' && !value) {
                    throw new Error('recurrencia_semanal is required for recurring schedules');
                }
            }
        }
    },
    // Fields for one-time schedules
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isRequiredForOneTime(value) {
                if (this.tipo === 'one-time' && !value) {
                    throw new Error('fecha is required for one-time schedules');
                }
            }
        }
    },
    fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    observacion: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isRequiredForOneTime(value) {
                if (this.tipo === 'one-time' && !value) {
                    throw new Error('observacion is required for one-time schedules');
                }
            }
        }
    },
    // Common fields
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(7),
        allowNull: false,
        validate: {
            is: /^#[0-9A-F]{6}$/i
        }
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        allowNull: false,
        defaultValue: 'Activo'
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
    tableName: 'schedules',
    timestamps: false,
    indexes: [
        {
            fields: ['tipo']
        },
        {
            fields: ['estado']
        },
        {
            fields: ['fecha_inicio']
        },
        {
            fields: ['fecha']
        }
    ]
});

Schedule.associate = (models) => {
    Schedule.hasMany(models.UserScheduleAssignment, {
        foreignKey: 'id_horario',
        as: 'assignments'
    });
};

module.exports = Schedule;