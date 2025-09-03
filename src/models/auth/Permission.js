const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Permission = sequelize.define(
  "Permission",
  {
    id_permiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre_permiso: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "permisos",
    timestamps: false,
    underscored: true,
  }
);

module.exports = Permission;
