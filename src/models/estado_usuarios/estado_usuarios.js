const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const EstadoUsuarios = sequelize.define('estado_usuarios', {
  id_estado_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/
    }
  }
}, {
  tableName: 'estado_usuarios',
  timestamps: false,
  underscored: true
});

module.exports = EstadoUsuarios;
