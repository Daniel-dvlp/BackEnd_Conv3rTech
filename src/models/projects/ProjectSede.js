const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectSede = sequelize.define('proyecto_sedes', {
  id_proyecto_sede: {
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
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  presupuesto_materiales: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  presupuesto_servicios: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  presupuesto_total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  presupuesto_restante: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'proyecto_sedes',
  timestamps: false,
  underscored: true
});

module.exports = ProjectSede;
