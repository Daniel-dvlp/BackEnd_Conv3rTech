const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SedeMaterial = sequelize.define('sede_materiales', {
  id_sede_material: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_proyecto_sede: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proyecto_sedes',
      key: 'id_proyecto_sede'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'productos',
      key: 'id_producto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sede_materiales',
  timestamps: false,
  underscored: true
});

module.exports = SedeMaterial;
