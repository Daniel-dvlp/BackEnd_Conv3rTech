const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const RolPermisoPrivilegio = sequelize.define('rol_permiso_privilegio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id_rol'
    }
  },
  id_permiso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permisos',
      key: 'id_permiso'
    }
  },
  id_privilegio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'privilegios',
      key: 'id_privilegio'
    }
  }
}, {
  tableName: 'rol_permiso_privilegio',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['id_rol', 'id_permiso', 'id_privilegio'],
      name: 'unique_rol_permiso_privilegio'
    }
  ]
});

module.exports = RolPermisoPrivilegio;
