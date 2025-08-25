const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectServicio = sequelize.define('proyecto_servicios', {
  id_proyecto_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_proyecto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proyectos',
      key: 'id_proyecto'
    }
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'servicios',
      key: 'id_servicio'
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
  precio_unitario: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  precio_total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'proyecto_servicios',
  timestamps: false,
  underscored: true
});

module.exports = ProjectServicio;
