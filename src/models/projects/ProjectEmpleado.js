const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ProjectEmpleado = sequelize.define('proyecto_empleados', {
  id_proyecto_empleado: {
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
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'proyecto_empleados',
  timestamps: false,
  underscored: true
});

module.exports = ProjectEmpleado;
