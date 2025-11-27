const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EmployeeShiftAssignment = sequelize.define('EmployeeShiftAssignment', {
    id_asignacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_instancia_turno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'instancias_turnos',
            key: 'id_instancia_turno'
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
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_confirmacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fecha_actualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'asignaciones_empleados_turnos',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id_instancia_turno', 'id_usuario']
        }
    ]
});

EmployeeShiftAssignment.associate = (models) => {
    EmployeeShiftAssignment.belongsTo(models.ShiftInstance, {
        foreignKey: 'id_instancia_turno',
        as: 'shiftInstance'
    });
    EmployeeShiftAssignment.belongsTo(models.User, {
        foreignKey: 'id_usuario',
        as: 'employee'
    });
};

module.exports = EmployeeShiftAssignment;