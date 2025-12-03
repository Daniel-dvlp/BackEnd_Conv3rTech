const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UsuarioPermisoPrivilegio = sequelize.define('usuario_permiso_privilegio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario',
    },
  },
  id_permiso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permisos',
      key: 'id_permiso',
    },
  },
  id_privilegio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'privilegios',
      key: 'id_privilegio',
    },
  },
}, {
  tableName: 'usuario_permiso_privilegio',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['id_usuario', 'id_permiso', 'id_privilegio'],
      name: 'unique_usuario_permiso_privilegio',
    },
  ],
});

module.exports = UsuarioPermisoPrivilegio;

