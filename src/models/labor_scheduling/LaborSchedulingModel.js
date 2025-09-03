const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../users/Users');

const LaborScheduling = sequelize.define('LaborScheduling', {
    id_programacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_inicio: {
        type: DataTypes.DATE,
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
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id_usuario'
        }
    }
}, {
    tableName: 'programaciones_laborales',
    timestamps: false
});

LaborScheduling.associate = (models) => {
    LaborScheduling.belongsTo(models.User, {
        foreignKey: 'id_usuario',
        as: 'user'
    });
};

module.exports = LaborScheduling;