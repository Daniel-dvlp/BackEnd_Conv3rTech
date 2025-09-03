const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Appointment = sequelize.define('Appointment', {
    id_cita: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_direccion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfter: new Date().toISOString() // fecha futura
        }
    },
    id_programacion_laboral: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Programada', 'Completada', 'Cancelada', 'Reprogramada'),
        defaultValue: 'Programada'
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'appointments',
    timestamps: false
});

module.exports = Appointment;
