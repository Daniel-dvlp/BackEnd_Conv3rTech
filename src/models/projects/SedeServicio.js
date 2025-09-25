const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SedeServicio = sequelize.define(
  "sede_servicios",
  {
    id_sede_servicio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_proyecto_sede: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "proyecto_sedes",
        key: "id_proyecto_sede",
      },
    },
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "servicios",
        key: "id_servicio",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "completado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    fecha_completado: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "sede_servicios",
    timestamps: false,
    underscored: true,
  }
);

module.exports = SedeServicio;
