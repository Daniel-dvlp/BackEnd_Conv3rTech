const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SalidaMaterial = sequelize.define('salidas_material', {
  id_salida_material: {
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
  id_proyecto_sede: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  id_entregador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    }
  },
  receptor: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  costo_total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'salidas_material',
  timestamps: false,
  underscored: true
});

module.exports = SalidaMaterial;
